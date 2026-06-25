// Course offering HTTP request handlers
const offeringService = require('../services/offeringService');
const { catchAsync } = require('../middleware/errorHandler');

exports.createOffering = catchAsync(async (req, res) => {
  const offering = await offeringService.createOffering(req.body);

  res.status(201).json({
    success: true,
    message: 'Course offering created successfully',
    data: { offering }
  });
});

exports.getAvailableOfferings = catchAsync(async (req, res) => {
  const offerings = await offeringService.getAvailableOfferings(req.query);

  res.json({
    success: true,
    data: { offerings }
  });
});

exports.getOffering = catchAsync(async (req, res) => {
  const offering = await offeringService.getOfferingById(req.params.offeringId);

  res.json({
    success: true,
    data: { offering }
  });
});

exports.updateOffering = catchAsync(async (req, res) => {
  const result = await offeringService.updateOffering(req.params.offeringId, req.body);

  res.json({
    success: true,
    message: result.message
  });
});

exports.deleteOffering = catchAsync(async (req, res) => {
  const result = await offeringService.deleteOffering(req.params.offeringId);

  res.json({
    success: true,
    message: result.message
  });
});
