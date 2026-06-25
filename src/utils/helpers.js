// Utility helper functions
const { GRADE_THRESHOLDS, GRADE_POINTS } = require('../config/constants');

/**
 * Generate unique ID with prefix
 */
function generateId(prefix) {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `${prefix}${timestamp}${random}`.toUpperCase();
}

/**
 * Calculate grade from total marks
 */
function calculateGrade(totalMarks) {
  const threshold = GRADE_THRESHOLDS.find(t => totalMarks >= t.min);
  return threshold ? threshold.grade : 'F';
}

/**
 * Calculate CGPA from enrollments
 */
function calculateCGPA(enrollments) {
  let totalCredits = 0;
  let weightedSum = 0;

  enrollments.forEach(enrollment => {
    if (enrollment.grade && enrollment.grade !== '-') {
      const points = GRADE_POINTS[enrollment.grade] || 0;
      totalCredits += enrollment.credits || 0;
      weightedSum += points * (enrollment.credits || 0);
    }
  });

  return totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : 0;
}

/**
 * Sanitize pagination params
 */
function getPaginationParams(query) {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

/**
 * Build pagination response
 */
function buildPaginationResponse(page, limit, total) {
  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    hasNext: page < Math.ceil(total / limit),
    hasPrev: page > 1
  };
}

/**
 * Safe object ID conversion
 */
function isValidObjectId(id) {
  return /^[a-f\d]{24}$/i.test(id);
}

/**
 * Remove sensitive fields from object
 */
function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...sanitized } = user;
  return sanitized;
}

module.exports = {
  generateId,
  calculateGrade,
  calculateCGPA,
  getPaginationParams,
  buildPaginationResponse,
  isValidObjectId,
  sanitizeUser
};
