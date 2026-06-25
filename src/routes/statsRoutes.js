// Statistics routes
const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

router.get('/dashboard', statsController.getDashboard);
router.get('/department/:department', statsController.getDepartmentStats);
router.get('/enrollment-trends', statsController.getEnrollmentTrends);
router.get('/top-performers', statsController.getTopPerformers);

module.exports = router;
