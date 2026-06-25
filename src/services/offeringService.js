// Course offering business logic
const database = require('../config/database');
const { generateId } = require('../utils/helpers');
const { AppError } = require('../middleware/errorHandler');

class OfferingService {
  async createOffering(data) {
    const db = database.getDb();

    // Get course details
    const course = await db.collection('courses').findOne({ courseCode: data.courseCode });
    if (!course) {
      throw new AppError('Course not found', 404);
    }

    // Get faculty details
    const faculty = await db.collection('faculty').findOne({ facultyId: data.facultyId });
    if (!faculty) {
      throw new AppError('Faculty not found', 404);
    }

    const offering = {
      offeringId: generateId('O'),
      courseCode: data.courseCode,
      facultyId: data.facultyId,
      facultyName: faculty.name,
      semester: data.semester,
      academicYear: data.academicYear,
      slot: data.slot,
      venue: data.venue || 'TBA',
      maxCapacity: course.maxCapacity,
      availableSeats: course.maxCapacity,
      enrolledCount: 0,
      credits: course.credits,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('courseOfferings').insertOne(offering);
    return offering;
  }

  async getAvailableOfferings(query) {
    const db = database.getDb();

    const semester = query.semester || 'Fall';
    const academicYear = query.academicYear || '2024-25';

    const filter = {
      semester,
      academicYear,
      availableSeats: { $gt: 0 }
    };

    if (query.department) {
      const courses = await db.collection('courses')
        .find({ department: query.department })
        .project({ courseCode: 1 })
        .toArray();

      const courseCodes = courses.map(c => c.courseCode);
      filter.courseCode = { $in: courseCodes };
    }

    const offerings = await db.collection('courseOfferings')
      .aggregate([
        { $match: filter },
        {
          $lookup: {
            from: 'courses',
            localField: 'courseCode',
            foreignField: 'courseCode',
            as: 'courseDetails'
          }
        },
        { $unwind: '$courseDetails' }
      ])
      .toArray();

    return offerings;
  }

  async getOfferingById(offeringId) {
    const db = database.getDb();
    const offering = await db.collection('courseOfferings').findOne({ offeringId });

    if (!offering) {
      throw new AppError('Course offering not found', 404);
    }

    return offering;
  }

  async updateOffering(offeringId, data) {
    const db = database.getDb();

    const updateData = {
      ...(data.facultyId && { facultyId: data.facultyId }),
      ...(data.slot && { slot: data.slot }),
      ...(data.venue && { venue: data.venue }),
      updatedAt: new Date()
    };

    const result = await db.collection('courseOfferings').updateOne(
      { offeringId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      throw new AppError('Course offering not found', 404);
    }

    return { message: 'Course offering updated successfully' };
  }

  async deleteOffering(offeringId) {
    const db = database.getDb();

    // Check if there are enrollments
    const enrollmentCount = await db.collection('enrollments').countDocuments({
      offeringId,
      status: 'Enrolled'
    });

    if (enrollmentCount > 0) {
      throw new AppError('Cannot delete offering with active enrollments', 400);
    }

    const result = await db.collection('courseOfferings').deleteOne({ offeringId });

    if (result.deletedCount === 0) {
      throw new AppError('Course offering not found', 404);
    }

    return { message: 'Course offering deleted successfully' };
  }
}

module.exports = new OfferingService();
