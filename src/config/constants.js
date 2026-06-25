// Application constants
module.exports = {
  GRADE_POINTS: {
    'A+': 10,
    'A': 9,
    'B+': 8,
    'B': 7,
    'C+': 6,
    'C': 5,
    'D': 4,
    'F': 0
  },

  GRADE_THRESHOLDS: [
    { min: 90, grade: 'A+' },
    { min: 80, grade: 'A' },
    { min: 70, grade: 'B+' },
    { min: 60, grade: 'B' },
    { min: 50, grade: 'C' },
    { min: 40, grade: 'D' },
    { min: 0, grade: 'F' }
  ],

  STUDENT_TYPES: ['undergraduate', 'postgraduate', 'phd'],

  COURSE_TYPES: ['Theory', 'Lab', 'Project', 'Seminar'],

  ENROLLMENT_STATUS: ['Enrolled', 'Dropped', 'Completed', 'Failed'],

  DESIGNATIONS: [
    'Professor',
    'Associate Professor',
    'Assistant Professor',
    'Senior Lecturer',
    'Lecturer'
  ],

  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100
  },

  SEMESTER_TYPES: ['Fall', 'Winter', 'Spring', 'Summer']
};
