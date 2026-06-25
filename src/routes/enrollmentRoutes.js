// Enrollment routes
const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const { validateEnrollment, validateGradeUpdate } = require('../middleware/validate');

router.post('/enroll', validateEnrollment, enrollmentController.enroll);
router.post('/:enrollmentId/drop', enrollmentController.dropCourse);
router.put('/:enrollmentId/grade', validateGradeUpdate, enrollmentController.updateGrade);
router.get('/student/:studentId', enrollmentController.getStudentEnrollments);
router.get('/course/:courseCode/students', enrollmentController.getCourseEnrollments);

module.exports = router;
