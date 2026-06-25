// Statistics HTTP request handlers
const statsService = require('../services/statsService');
const { catchAsync } = require('../middleware/errorHandler');

exports.getDashboard = catchAsync(async (req, res) => {
  const stats = await statsService.getDashboardStats();

  res.json({
    success: true,
    data: { stats }
  });
});

exports.getDepartmentStats = catchAsync(async (req, res) => {
  const stats = await statsService.getDepartmentStats(req.params.department);

  res.json({
    success: true,
    data: { stats }
  });
});

exports.getEnrollmentTrends = catchAsync(async (req, res) => {
  const academicYear = req.query.academicYear || '2024-25';
  const trends = await statsService.getEnrollmentTrends(academicYear);

  res.json({
    success: true,
    data: { trends }
  });
});

exports.getTopPerformers = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const performers = await statsService.getTopPerformers(limit);

  res.json({
    success: true,
    data: { performers }
  });
});
