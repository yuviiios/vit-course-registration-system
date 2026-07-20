import { useMemo } from 'react';
import type { TimetableCourse } from '@/types';
import { getCourseColor } from '@/utils/timetableParser';
import { resolveSlot } from '@/utils/slotMapping';
import { Card } from '@/components/ui/card';

interface WeeklyViewProps {
  courses: TimetableCourse[];
}

interface TimeSlot {
  time: string;
  courses: Record<string, TimetableCourse | null>;
}

export function WeeklyView({ courses }: WeeklyViewProps) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const schedule = useMemo(() => {
    const slots: Record<string, Record<string, TimetableCourse>> = {};

    courses.forEach((course) => {
      const slotTimes = resolveSlot(course.slot);
      if (!slotTimes.length) return;

      slotTimes.forEach(({ day, startTime, endTime }) => {
        const timeKey = `${startTime}-${endTime}`;
        if (!slots[timeKey]) slots[timeKey] = {};
        slots[timeKey][day] = course;
      });
    });

    // Convert to sorted array
    return Object.entries(slots)
      .map(([time, dayCourses]) => ({
        time: time.split('-')[0],
        courses: dayCourses,
      }))
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [courses]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Weekly Timetable</h3>
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header */}
          <div className="grid grid-cols-6 gap-2 mb-2">
            <div className="font-semibold text-sm text-muted-foreground">Time</div>
            {days.map((day) => (
              <div key={day} className="font-semibold text-sm text-center">
                {day}
              </div>
            ))}
          </div>

          {/* Time slots */}
          <div className="space-y-2">
            {schedule.map((slot) => (
              <div key={slot.time} className="grid grid-cols-6 gap-2">
                <div className="text-sm font-medium text-muted-foreground py-2">
                  {slot.time}
                </div>
                {days.map((day) => {
                  const course = slot.courses[day];
                  return (
                    <Card
                      key={day}
                      className={`p-2 min-h-[60px] ${
                        course
                          ? `${getCourseColor(course.courseCode)} text-white`
                          : 'bg-muted/20'
                      }`}
                    >
                      {course && (
                        <div className="text-xs space-y-0.5">
                          <div className="font-semibold truncate">
                            {course.courseCode}
                          </div>
                          <div className="truncate opacity-90">
                            {course.subjectName}
                          </div>
                          <div className="opacity-75">{course.venue}</div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            ))}
          </div>

          {schedule.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No timetable data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
