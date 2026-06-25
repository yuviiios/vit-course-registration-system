// Enrollment HTTP request handlers
const enrollmentService = require('../services/enrollmentService');
const { catchAsync } = require('../middleware/errorHandler');

exports.enroll = catchAsync(async (req, res) => {
  const { studentId, offeringId } = req.body;
  const enrollment = await enrollmentService.enrollStudent(studentId, offeringId);

  res.status(201).json({
    success: true,
    message: 'Enrollment successful',
    data: { enrollment }
  });
});

exports.dropCourse = catchAsync(async (req, res) => {
  const result = await enrollmentService.dropCourse(req.params.enrollmentId);

  res.json({
    success: true,
    message: result.message
  });
});

exports.getStudentEnrollments = catchAsync(async (req, res) => {
  const result = await enrollmentService.getStudentEnrollments(
    req.params.studentId,
    req.query
  );

  res.json({
    success: true,
    data: {
      enrollments: result.enrollments,
      cgpa: result.cgpa
    }
  });
});

exports.getCourseEnrollments = catchAsync(async (req, res) => {
  const result = await enrollmentService.getCourseEnrollments(
    req.params.courseCode,
    req.query
  );

  res.json({
    success: true,
    data: {
      count: result.count,
      enrollments: result.enrollments
    }
  });
});

exports.updateGrade = catchAsync(async (req, res) => {
  const { internalMarks, finalMarks } = req.body;
  const result = await enrollmentService.updateGrade(
    req.params.enrollmentId,
    internalMarks,
    finalMarks
  );

  res.json({
    success: true,
    message: 'Grade updated successfully',
    data: {
      grade: result.grade,
      totalMarks: result.totalMarks,
      cgpa: result.cgpa
    }
  });
});
