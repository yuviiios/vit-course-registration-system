// Request validation middleware
const { AppError } = require('./errorHandler');
const validators = require('../utils/validators');

/**
 * Validate student registration data
 */
function validateStudentRegistration(req, res, next) {
  const { registrationNumber, name, email, password, branch } = req.body;

  if (!registrationNumber || !name || !email || !password || !branch) {
    return next(new AppError('Missing required fields: registrationNumber, name, email, password, branch', 400));
  }

  if (!validators.isValidEmail(email)) {
    return next(new AppError('Invalid email format', 400));
  }

  if (!validators.isValidRegistrationNumber(registrationNumber)) {
    return next(new AppError('Invalid registration number format (e.g., 21BCE0001)', 400));
  }

  if (password.length < 6) {
    return next(new AppError('Password must be at least 6 characters', 400));
  }

  if (req.body.phone && !validators.isValidPhone(req.body.phone)) {
    return next(new AppError('Invalid phone number format', 400));
  }

  if (req.body.type && !validators.isValidStudentType(req.body.type)) {
    return next(new AppError('Invalid student type', 400));
  }

  next();
}

/**
 * Validate course creation data
 */
function validateCourseCreation(req, res, next) {
  const { courseCode, courseName, credits, department } = req.body;

  if (!courseCode || !courseName || !credits || !department) {
    return next(new AppError('Missing required fields: courseCode, courseName, credits, department', 400));
  }

  if (!validators.isValidCourseCode(courseCode)) {
    return next(new AppError('Invalid course code format (e.g., CSE101)', 400));
  }

  if (!validators.isValidCredits(credits)) {
    return next(new AppError('Credits must be between 1 and 6', 400));
  }

  if (req.body.courseType && !validators.isValidCourseType(req.body.courseType)) {
    return next(new AppError('Invalid course type', 400));
  }

  next();
}

/**
 * Validate enrollment data
 */
function validateEnrollment(req, res, next) {
  const { studentId, offeringId } = req.body;

  if (!studentId || !offeringId) {
    return next(new AppError('Missing required fields: studentId, offeringId', 400));
  }

  next();
}

/**
 * Validate grade update data
 */
function validateGradeUpdate(req, res, next) {
  const { internalMarks, finalMarks } = req.body;

  if (internalMarks === undefined && finalMarks === undefined) {
    return next(new AppError('At least one of internalMarks or finalMarks is required', 400));
  }

  if (internalMarks !== undefined && !validators.isValidMarks(internalMarks)) {
    return next(new AppError('Internal marks must be between 0 and 100', 400));
  }

  if (finalMarks !== undefined && !validators.isValidMarks(finalMarks)) {
    return next(new AppError('Final marks must be between 0 and 100', 400));
  }

  next();
}

/**
 * Validate offering creation data
 */
function validateOfferingCreation(req, res, next) {
  const { courseCode, facultyId, semester, academicYear, slot } = req.body;

  if (!courseCode || !facultyId || !semester || !academicYear || !slot) {
    return next(new AppError('Missing required fields: courseCode, facultyId, semester, academicYear, slot', 400));
  }

  next();
}

/**
 * Validate faculty creation data
 */
function validateFacultyCreation(req, res, next) {
  const { name, email, department } = req.body;

  if (!name || !email || !department) {
    return next(new AppError('Missing required fields: name, email, department', 400));
  }

  if (!validators.isValidEmail(email)) {
    return next(new AppError('Invalid email format', 400));
  }

  next();
}

/**
 * Validate student update data
 */
function validateStudentUpdate(req, res, next) {
  const { email, phone, semester } = req.body;

  if (email && !validators.isValidEmail(email)) {
    return next(new AppError('Invalid email format', 400));
  }

  if (phone && !validators.isValidPhone(phone)) {
    return next(new AppError('Invalid phone number format', 400));
  }

  if (semester && !validators.isValidSemester(semester)) {
    return next(new AppError('Semester must be between 1 and 12', 400));
  }

  next();
}

module.exports = {
  validateStudentRegistration,
  validateCourseCreation,
  validateEnrollment,
  validateGradeUpdate,
  validateOfferingCreation,
  validateFacultyCreation,
  validateStudentUpdate
};
