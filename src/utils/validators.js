// Input validation functions
const { STUDENT_TYPES, COURSE_TYPES, ENROLLMENT_STATUS } = require('../config/constants');

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone format (Indian)
 */
function isValidPhone(phone) {
  const phoneRegex = /^[+]?[\d\s-()]+$/;
  return !phone || phoneRegex.test(phone);
}

/**
 * Validate registration number format
 */
function isValidRegistrationNumber(regNum) {
  // Format: 21BCE0001, 21BMECH0045, etc.
  const regNumRegex = /^\d{2}[A-Z]{3,6}\d{4}$/;
  return regNumRegex.test(regNum);
}

/**
 * Validate course code format
 */
function isValidCourseCode(code) {
  // Format: CSE101, MECH202, etc.
  const codeRegex = /^[A-Z]{2,6}\d{3}$/;
  return codeRegex.test(code);
}

/**
 * Validate student type
 */
function isValidStudentType(type) {
  return STUDENT_TYPES.includes(type);
}

/**
 * Validate course type
 */
function isValidCourseType(type) {
  return COURSE_TYPES.includes(type);
}

/**
 * Validate enrollment status
 */
function isValidEnrollmentStatus(status) {
  return ENROLLMENT_STATUS.includes(status);
}

/**
 * Validate marks range
 */
function isValidMarks(marks) {
  const numMarks = parseInt(marks);
  return !isNaN(numMarks) && numMarks >= 0 && numMarks <= 100;
}

/**
 * Validate credits
 */
function isValidCredits(credits) {
  const numCredits = parseInt(credits);
  return !isNaN(numCredits) && numCredits >= 1 && numCredits <= 6;
}

/**
 * Validate semester
 */
function isValidSemester(semester) {
  const numSemester = parseInt(semester);
  return !isNaN(numSemester) && numSemester >= 1 && numSemester <= 12;
}

/**
 * Validate CGPA
 */
function isValidCGPA(cgpa) {
  const numCGPA = parseFloat(cgpa);
  return !isNaN(numCGPA) && numCGPA >= 0 && numCGPA <= 10;
}

/**
 * Validate date
 */
function isValidDate(date) {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
}

module.exports = {
  isValidEmail,
  isValidPhone,
  isValidRegistrationNumber,
  isValidCourseCode,
  isValidStudentType,
  isValidCourseType,
  isValidEnrollmentStatus,
  isValidMarks,
  isValidCredits,
  isValidSemester,
  isValidCGPA,
  isValidDate
};
