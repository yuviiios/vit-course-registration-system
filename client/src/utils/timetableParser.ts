import type { TimetableCourse, TimetableStats } from '@/types';

/**
 * Parse VTOP timetable text into structured course data
 */
export function parseTimetable(text: string): TimetableCourse[] {
  const courses: TimetableCourse[] = [];
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  let i = 0;
  while (i < lines.length) {
    // Skip header or irrelevant lines
    if (lines[i].startsWith('Sl.No') || lines[i].startsWith('Registered and Approved')) {
      i++;
      continue;
    }

    // Match course code pattern: BCSE312L, CSE1001, etc.
    const courseCodeMatch = lines[i].match(/^([A-Z]{3,4}\d{3,4}[A-Z]?)\s*-\s*(.+)/);
    if (!courseCodeMatch) {
      i++;
      continue;
    }

    const courseCode = courseCodeMatch[1];
    const subjectName = courseCodeMatch[2];

    // Parse course type
    i++;
    let courseType: 'Theory' | 'Lab' | 'Project' = 'Theory';
    if (i < lines.length) {
      const typeStr = lines[i].toLowerCase();
      if (typeStr.includes('lab')) courseType = 'Lab';
      else if (typeStr.includes('project')) courseType = 'Project';
      i++;
    }

    // Parse credits (e.g., "2 0 0 0 2.0")
    let credits = 0;
    if (i < lines.length && /^\d+\s+\d+\s+\d+\s+\d+\s+[\d.]+/.test(lines[i])) {
      const creditsMatch = lines[i].match(/[\d.]+$/);
      if (creditsMatch) {
        credits = parseFloat(creditsMatch[0]);
      }
      i++;
    }

    // Parse category
    let category = '';
    if (i < lines.length && !lines[i].match(/^VL\d+|^Regular$/)) {
      category = lines[i];
      i++;
    }

    // Skip registration type (Regular)
    if (i < lines.length && lines[i] === 'Regular') {
      i++;
    }

    // Skip reference number (VL2026270102461)
    if (i < lines.length && lines[i].match(/^VL\d+/)) {
      i++;
    }

    // Parse slot (e.g., "D1 -", "A1+TA1 -", "L37+L38+L51+L52 -", "NIL -")
    let slot = '';
    if (i < lines.length) {
      // Match single or combined slots with optional trailing dash/spaces
      const slotMatch = lines[i].match(/^([A-Z]+\d+(?:\+[A-Z]+\d+)*)\s*-?\s*$/);
      if (slotMatch) {
        slot = slotMatch[1];
        i++;
      } else if (lines[i].match(/^NIL\s*-?\s*$/)) {
        // Skip NIL slots
        slot = '';
        i++;
      }
    }

    // Parse venue (e.g., "SJT408", "PRP135", "NIL")
    // Venue format: 3 uppercase letters + digits, or NIL
    let venue = '';
    if (i < lines.length) {
      if (lines[i].match(/^[A-Z]{3}\d+$/)) {
        venue = lines[i];
        i++;
      } else if (lines[i] === 'NIL') {
        venue = '';
        i++;
      }
    }

    // Parse faculty (e.g., "SYAMASUDHA VEERAGANDHAM -", "PRIYANKA N -")
    let faculty = '';
    if (i < lines.length && lines[i].includes('-')) {
      faculty = lines[i].replace(/\s*-\s*$/, '').trim();
      i++;
    }

    // Parse school (e.g., "SCOPE", "SENSE", "SAS", "SSL")
    let school = '';
    if (i < lines.length && lines[i].match(/^[A-Z]{3,}$/)) {
      school = lines[i];
      i++;
    }

    // Skip attendance/dates/status until "Registered and Approved" (or variants like "by Guide")
    while (i < lines.length && !lines[i].startsWith('Registered and Approved')) {
      i++;
    }

    // Add course if valid
    if (courseCode && subjectName) {
      courses.push({
        courseCode,
        subjectName,
        courseType,
        credits,
        category,
        slot,
        venue,
        faculty,
        school,
        status: 'Registered and Approved',
      });
    }

    i++;
  }

  // Remove duplicates
  const uniqueCourses = courses.filter(
    (course, index, self) =>
      index === self.findIndex((c) => c.courseCode === course.courseCode)
  );

  return uniqueCourses;
}

/**
 * Calculate timetable statistics
 */
export function calculateStats(courses: TimetableCourse[]): TimetableStats {
  return {
    totalCourses: courses.length,
    theoryCourses: courses.filter((c) => c.courseType === 'Theory').length,
    labCourses: courses.filter((c) => c.courseType === 'Lab').length,
    projectCourses: courses.filter((c) => c.courseType === 'Project').length,
    totalCredits: courses.reduce((sum, c) => sum + c.credits, 0),
  };
}

// Slot timing mappings moved to slotMapping.ts for official VIT mappings

/**
 * Generate course color based on course code
 */
export function getCourseColor(courseCode: string): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-teal-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-cyan-500',
  ];

  let hash = 0;
  for (let i = 0; i < courseCode.length; i++) {
    hash = courseCode.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}
