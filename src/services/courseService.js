// Course business logic
const database = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

class CourseService {
  async createCourse(data) {
    const db = database.getDb();

    // Check if course exists
    const existing = await db.collection('courses').findOne({ courseCode: data.courseCode });
    if (existing) {
      throw new AppError('Course already exists', 400);
    }

    const course = {
      courseCode: data.courseCode,
      courseName: data.courseName,
      credits: parseInt(data.credits),
      department: data.department,
      courseType: data.courseType || 'Theory',
      maxCapacity: parseInt(data.maxCapacity) || 120,
      description: data.description || '',
      prerequisites: data.prerequisites || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('courses').insertOne(course);
    return course;
  }

  async getCourseByCode(courseCode) {
    const db = database.getDb();
    const course = await db.collection('courses').findOne({ courseCode });

    if (!course) {
      throw new AppError('Course not found', 404);
    }

    return course;
  }

  async getAllCourses(query) {
    const db = database.getDb();

    const filter = {};
    if (query.department) filter.department = query.department;
    if (query.courseType) filter.courseType = query.courseType;

    const courses = await db.collection('courses').find(filter).toArray();
    return courses;
  }

  async updateCourse(courseCode, data) {
    const db = database.getDb();

    const updateData = {
      ...(data.courseName && { courseName: data.courseName }),
      ...(data.credits && { credits: parseInt(data.credits) }),
      ...(data.department && { department: data.department }),
      ...(data.courseType && { courseType: data.courseType }),
      ...(data.maxCapacity && { maxCapacity: parseInt(data.maxCapacity) }),
      ...(data.description && { description: data.description }),
      ...(data.prerequisites && { prerequisites: data.prerequisites }),
      updatedAt: new Date()
    };

    const result = await db.collection('courses').updateOne(
      { courseCode },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      throw new AppError('Course not found', 404);
    }

    return { message: 'Course updated successfully' };
  }

  async deleteCourse(courseCode) {
    const db = database.getDb();
    const result = await db.collection('courses').deleteOne({ courseCode });

    if (result.deletedCount === 0) {
      throw new AppError('Course not found', 404);
    }

    return { message: 'Course deleted successfully' };
  }
}

module.exports = new CourseService();
