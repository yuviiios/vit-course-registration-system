// Course routes
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { validateCourseCreation } = require('../middleware/validate');

router.post('/', validateCourseCreation, courseController.createCourse);
router.get('/', courseController.getAllCourses);
router.get('/:code', courseController.getCourse);
router.put('/:code', courseController.updateCourse);
router.delete('/:code', courseController.deleteCourse);

module.exports = router;
