// Statistics and analytics business logic
const database = require('../config/database');

class StatsService {
  async getDashboardStats() {
    const db = database.getDb();

    const [
      totalStudents,
      totalCourses,
      totalEnrollments,
      totalFaculty,
      branchStats,
      courseStats
    ] = await Promise.all([
      db.collection('students').countDocuments(),
      db.collection('courses').countDocuments(),
      db.collection('enrollments').countDocuments({ status: 'Enrolled' }),
      db.collection('faculty').countDocuments(),

      // Branch-wise student count
      db.collection('students').aggregate([
        { $group: { _id: '$branch', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]).toArray(),

      // Course-wise enrollment count
      db.collection('enrollments').aggregate([
        { $match: { status: 'Enrolled' } },
        { $group: { _id: '$courseCode', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]).toArray()
    ]);

    return {
      totalStudents,
      totalCourses,
      totalEnrollments,
      totalFaculty,
      branchStats,
      courseStats
    };
  }

  async getDepartmentStats(department) {
    const db = database.getDb();

    const [studentCount, courseCount, facultyCount] = await Promise.all([
      db.collection('students').countDocuments({ branch: department }),
      db.collection('courses').countDocuments({ department }),
      db.collection('faculty').countDocuments({ department })
    ]);

    return {
      department,
      studentCount,
      courseCount,
      facultyCount
    };
  }

  async getEnrollmentTrends(academicYear) {
    const db = database.getDb();

    const trends = await db.collection('enrollments').aggregate([
      { $match: { academicYear } },
      {
        $group: {
          _id: { semester: '$semester', courseCode: '$courseCode' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.semester': 1, count: -1 } }
    ]).toArray();

    return trends;
  }

  async getTopPerformers(limit = 10) {
    const db = database.getDb();

    const topPerformers = await db.collection('students')
      .find({ cgpa: { $gt: 0 } }, { projection: { password: 0 } })
      .sort({ cgpa: -1 })
      .limit(limit)
      .toArray();

    return topPerformers;
  }
}

module.exports = new StatsService();
