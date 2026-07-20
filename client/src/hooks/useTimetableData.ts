import { useState, useEffect } from 'react';
import type { TimetableCourse, TimetableStats } from '@/types';
import { calculateStats } from '@/utils/timetableParser';

const STORAGE_KEY = 'vit_timetable_data';

interface TimetableData {
  courses: TimetableCourse[];
  stats: TimetableStats | null;
}

/**
 * Hook to access VTOP imported timetable data
 */
export function useTimetableData() {
  const [data, setData] = useState<TimetableData>({ courses: [], stats: null });
  const [isLoaded, setIsLoaded] = useState(false);

  const loadData = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setData({
          courses: parsed.courses || [],
          stats: parsed.stats || null,
        });
      } else {
        setData({ courses: [], stats: null });
      }
    } catch {
      setData({ courses: [], stats: null });
    } finally {
      setIsLoaded(true);
    }
  };

  const clearData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData({ courses: [], stats: null });
  };

  const refreshData = () => {
    loadData();
  };

  useEffect(() => {
    loadData();

    // Listen for storage changes (cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    courses: data.courses,
    stats: data.stats,
    hasData: data.courses.length > 0,
    isLoaded,
    clearData,
    refreshData,
  };
}

/**
 * Get courses excluding projects/non-graded
 */
export function getActiveCourses(courses: TimetableCourse[]): TimetableCourse[] {
  return courses.filter(
    (c) => c.courseType !== 'Project' && c.slot && c.slot !== 'NIL'
  );
}

/**
 * Merge backend enrollments with VTOP courses
 * VTOP data takes priority for matching courses
 */
export function mergeCourses<T extends { courseCode: string }>(
  backendCourses: T[],
  vtopCourses: TimetableCourse[]
): Array<T & { vtopData?: TimetableCourse; source: 'backend' | 'vtop' | 'both' }> {
  const vtopMap = new Map(vtopCourses.map((c) => [c.courseCode, c]));
  const backendMap = new Map(backendCourses.map((c) => [c.courseCode, c]));

  const merged: Array<T & { vtopData?: TimetableCourse; source: 'backend' | 'vtop' | 'both' }> =
    [];

  // Add backend courses with VTOP data if available
  backendCourses.forEach((course) => {
    const vtopData = vtopMap.get(course.courseCode);
    merged.push({
      ...course,
      vtopData,
      source: vtopData ? 'both' : 'backend',
    });
  });

  // Add VTOP-only courses
  vtopCourses.forEach((course) => {
    if (!backendMap.has(course.courseCode)) {
      // Create minimal backend course structure
      merged.push({
        courseCode: course.courseCode,
        courseName: course.subjectName,
        vtopData: course,
        source: 'vtop',
      } as T & { vtopData?: TimetableCourse; source: 'backend' | 'vtop' | 'both' });
    }
  });

  return merged;
}
