// Central route registry
const express = require('express');
const router = express.Router();

const studentRoutes = require('./studentRoutes');
const courseRoutes = require('./courseRoutes');
const enrollmentRoutes = require('./enrollmentRoutes');
const offeringRoutes = require('./offeringRoutes');
const facultyRoutes = require('./facultyRoutes');
const statsRoutes = require('./statsRoutes');

router.use('/students', studentRoutes);
router.use('/courses', courseRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/offerings', offeringRoutes);
router.use('/faculty', facultyRoutes);
router.use('/stats', statsRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'VIT Course Registration API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
