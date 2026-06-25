// Student routes
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { validateStudentRegistration, validateStudentUpdate } = require('../middleware/validate');

router.post('/register', validateStudentRegistration, studentController.register);
router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudent);
router.put('/:id', validateStudentUpdate, studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
