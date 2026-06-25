// Faculty routes
const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');
const { validateFacultyCreation } = require('../middleware/validate');

router.post('/', validateFacultyCreation, facultyController.createFaculty);
router.get('/', facultyController.getAllFaculty);
router.get('/:facultyId', facultyController.getFaculty);
router.put('/:facultyId', facultyController.updateFaculty);
router.delete('/:facultyId', facultyController.deleteFaculty);

module.exports = router;
