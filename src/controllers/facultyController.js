// Faculty HTTP request handlers
const facultyService = require('../services/facultyService');
const { catchAsync } = require('../middleware/errorHandler');

exports.createFaculty = catchAsync(async (req, res) => {
  const faculty = await facultyService.createFaculty(req.body);

  res.status(201).json({
    success: true,
    message: 'Faculty created successfully',
    data: { faculty }
  });
});

exports.getAllFaculty = catchAsync(async (req, res) => {
  const faculty = await facultyService.getAllFaculty(req.query);

  res.json({
    success: true,
    data: { faculty }
  });
});

exports.getFaculty = catchAsync(async (req, res) => {
  const faculty = await facultyService.getFacultyById(req.params.facultyId);

  res.json({
    success: true,
    data: { faculty }
  });
});

exports.updateFaculty = catchAsync(async (req, res) => {
  const result = await facultyService.updateFaculty(req.params.facultyId, req.body);

  res.json({
    success: true,
    message: result.message
  });
});

exports.deleteFaculty = catchAsync(async (req, res) => {
  const result = await facultyService.deleteFaculty(req.params.facultyId);

  res.json({
    success: true,
    message: result.message
  });
});
