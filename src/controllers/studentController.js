// Student HTTP request handlers
const studentService = require('../services/studentService');
const { catchAsync } = require('../middleware/errorHandler');

exports.register = catchAsync(async (req, res) => {
  const student = await studentService.createStudent(req.body);

  res.status(201).json({
    success: true,
    message: 'Student registered successfully',
    data: { student }
  });
});

exports.getStudent = catchAsync(async (req, res) => {
  const student = await studentService.getStudentById(req.params.id);

  res.json({
    success: true,
    data: { student }
  });
});

exports.updateStudent = catchAsync(async (req, res) => {
  const result = await studentService.updateStudent(req.params.id, req.body);

  res.json({
    success: true,
    message: result.message
  });
});

exports.getAllStudents = catchAsync(async (req, res) => {
  const result = await studentService.getAllStudents(req.query);

  res.json({
    success: true,
    data: {
      students: result.students,
      pagination: result.pagination
    }
  });
});

exports.deleteStudent = catchAsync(async (req, res) => {
  const result = await studentService.deleteStudent(req.params.id);

  res.json({
    success: true,
    message: result.message
  });
});
