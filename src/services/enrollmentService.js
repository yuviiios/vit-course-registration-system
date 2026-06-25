// Enrollment business logic
const database = require('../config/database');
const { generateId, calculateGrade, calculateCGPA } = require('../utils/helpers');
const { AppError } = require('../middleware/errorHandler');
const studentService = require('./studentService');

class EnrollmentService {
  async enrollStudent(studentId, offeringId) {
    const db = database.getDb();

    // Check student exists
    const student = await db.collection('students').findOne({ studentId });
    if (!student) {
      throw new AppError('Student not found', 404);
    }

    // Check offering exists and has seats
    const offering = await db.collection('courseOfferings').findOne({ offeringId });
    if (!offering) {
      throw new AppError('Course offering not found', 404);
    }

    if (offering.availableSeats <= 0) {
      throw new AppError('No seats available. Course is full.', 400);
    }

    // Check if already enrolled
    const existingEnrollment = await db.collection('enrollments').findOne({
      studentId,
      offeringId
    });

    if (existingEnrollment) {
      throw new AppError('Already enrolled in this course', 400);
    }

    // Check for time slot conflicts
    await this.checkSlotConflicts(studentId, offering);

    // Create enrollment
    const enrollment = {
      enrollmentId: generateId('E'),
      studentId,
      offeringId,
      courseCode: offering.courseCode,
      studentName: student.name,
      facultyName: offering.facultyName,
      enrollmentDate: new Date(),
      semester: offering.semester,
      academicYear: offering.academicYear,
      status: 'Enrolled',
      attendance: 0,
      internalMarks: null,
      finalMarks: null,
      grade: null,
      credits: offering.credits,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Transaction-like operations
    await db.collection('enrollments').insertOne(enrollment);
    await db.collection('courseOfferings').updateOne(
      { offeringId },
      {
        $inc: { availableSeats: -1, enrolledCount: 1 },
        $set: { updatedAt: new Date() }
      }
    );

    return enrollment;
  }

  async checkSlotConflicts(studentId, newOffering) {
    const db = database.getDb();

    const studentEnrollments = await db.collection('enrollments').find({
      studentId,
      semester: newOffering.semester,
      academicYear: newOffering.academicYear,
      status: 'Enrolled'
    }).toArray();

    for (let enrollment of studentEnrollments) {
      const enrolledOffering = await db.collection('courseOfferings').findOne({
        offeringId: enrollment.offeringId
      });

      if (enrolledOffering && enrolledOffering.slot === newOffering.slot) {
        throw new AppError(`Time slot conflict with ${enrolledOffering.courseCode}`, 400);
      }
    }
  }

  async dropCourse(enrollmentId) {
    const db = database.getDb();

    const enrollment = await db.collection('enrollments').findOne({ enrollmentId });
    if (!enrollment) {
      throw new AppError('Enrollment not found', 404);
    }

    if (enrollment.status !== 'Enrolled') {
      throw new AppError('Cannot drop this course', 400);
    }

    // Update enrollment status
    await db.collection('enrollments').updateOne(
      { enrollmentId },
      {
        $set: {
          status: 'Dropped',
          updatedAt: new Date()
        }
      }
    );

    // Update seat availability
    await db.collection('courseOfferings').updateOne(
      { offeringId: enrollment.offeringId },
      {
        $inc: { availableSeats: 1, enrolledCount: -1 },
        $set: { updatedAt: new Date() }
      }
    );

    return { message: 'Course dropped successfully' };
  }

  async getStudentEnrollments(studentId, query) {
    const db = database.getDb();

    const filter = { studentId };
    if (query.semester) filter.semester = query.semester;
    if (query.academicYear) filter.academicYear = query.academicYear;
    if (query.status) filter.status = query.status;

    const enrollments = await db.collection('enrollments')
      .aggregate([
        { $match: filter },
        {
          $lookup: {
            from: 'courseOfferings',
            localField: 'offeringId',
            foreignField: 'offeringId',
            as: 'offeringDetails'
          }
        },
        {
          $lookup: {
            from: 'courses',
            localField: 'courseCode',
            foreignField: 'courseCode',
            as: 'courseDetails'
          }
        },
        { $unwind: { path: '$offeringDetails', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$courseDetails', preserveNullAndEmptyArrays: true } }
      ])
      .toArray();

    // Calculate CGPA
    const cgpa = calculateCGPA(enrollments);

    return {
      enrollments,
      cgpa: parseFloat(cgpa)
    };
  }

  async getCourseEnrollments(courseCode, query) {
    const db = database.getDb();

    const filter = { courseCode, status: 'Enrolled' };
    if (query.offeringId) filter.offeringId = query.offeringId;

    const enrollments = await db.collection('enrollments')
      .aggregate([
        { $match: filter },
        {
          $lookup: {
            from: 'students',
            localField: 'studentId',
            foreignField: 'studentId',
            as: 'studentDetails'
          }
        },
        { $unwind: '$studentDetails' },
        {
          $project: {
            'studentDetails.password': 0
          }
        }
      ])
      .toArray();

    return {
      count: enrollments.length,
      enrollments
    };
  }

  async updateGrade(enrollmentId, internalMarks, finalMarks) {
    const db = database.getDb();

    const enrollment = await db.collection('enrollments').findOne({ enrollmentId });
    if (!enrollment) {
      throw new AppError('Enrollment not found', 404);
    }

    const internal = internalMarks !== undefined ? parseInt(internalMarks) : enrollment.internalMarks || 0;
    const final = finalMarks !== undefined ? parseInt(finalMarks) : enrollment.finalMarks || 0;
    const totalMarks = internal + final;
    const grade = calculateGrade(totalMarks);

    await db.collection('enrollments').updateOne(
      { enrollmentId },
      {
        $set: {
          internalMarks: internal,
          finalMarks: final,
          grade,
          status: 'Completed',
          updatedAt: new Date()
        }
      }
    );

    // Update student CGPA
    const allEnrollments = await db.collection('enrollments')
      .find({ studentId: enrollment.studentId })
      .toArray();

    const cgpa = calculateCGPA(allEnrollments);
    await studentService.updateCGPA(enrollment.studentId, cgpa);

    return {
      grade,
      totalMarks,
      cgpa: parseFloat(cgpa)
    };
  }
}

module.exports = new EnrollmentService();
