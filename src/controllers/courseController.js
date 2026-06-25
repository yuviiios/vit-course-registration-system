// Course HTTP request handlers
const courseService = require('../services/courseService');
const { catchAsync } = require('../middleware/errorHandler');

exports.createCourse = catchAsync(async (req, res) => {
  const course = await courseService.createCourse(req.body);

  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    data: { course }
  });
});

exports.getCourse = catchAsync(async (req, res) => {
  const course = await courseService.getCourseByCode(req.params.code);

  res.json({
    success: true,
    data: { course }
  });
});

exports.getAllCourses = catchAsync(async (req, res) => {
  const courses = await courseService.getAllCourses(req.query);

  res.json({
    success: true,
    data: { courses }
  });
});

exports.updateCourse = catchAsync(async (req, res) => {
  const result = await courseService.updateCourse(req.params.code, req.body);

  res.json({
    success: true,
    message: result.message
  });
});

exports.deleteCourse = catchAsync(async (req, res) => {
  const result = await courseService.deleteCourse(req.params.code);

  res.json({
    success: true,
    message: result.message
  });
});
