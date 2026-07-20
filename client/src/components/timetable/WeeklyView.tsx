import { useMemo } from 'react';
import type { TimetableCourse } from '@/types';
import { getCourseColor } from '@/utils/timetableParser';
import { resolveSlot } from '@/utils/slotMapping';
import { Card } from '@/components/ui/card';

interface WeeklyViewProps {
  courses: TimetableCourse[];
}

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

export function WeeklyView({ courses }: WeeklyViewProps) {
  const { schedule, days } = useMemo(() => {
    const slots: Record<string, Record<string, TimetableCourse[]>> = {};
    const activeDays = new Set<string>();

    courses.forEach((course) => {
      const slotTimes = resolveSlot(course.slot);
      if (!slotTimes.length) return;

      slotTimes.forEach(({ day, startTime, endTime }) => {
        const timeKey = `${startTime}-${endTime}`;
        if (!slots[timeKey]) slots[timeKey] = {};
        if (!slots[timeKey][day]) slots[timeKey][day] = [];
        const existing = slots[timeKey][day];
        if (!existing.some((c) => c.courseCode === course.courseCode)) {
          existing.push(course);
        }
        activeDays.add(day);
      });
    });

    const days = ALL_DAYS.filter((d) => activeDays.has(d));

    const schedule = Object.entries(slots)
      .map(([time, dayCourses]) => ({
        time,
        displayTime: time.split('-')[0],
        courses: dayCourses,
      }))
      .sort((a, b) => a.displayTime.localeCompare(b.displayTime));

    return { schedule, days };
  }, [courses]);

  const gridCols = `grid-cols-${days.length + 1}`;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Weekly Timetable</h3>
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header */}
          <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: `80px repeat(${days.length}, 1fr)` }}>
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
              <div key={slot.time} className="grid gap-2" style={{ gridTemplateColumns: `80px repeat(${days.length}, 1fr)` }}>
                <div className="text-sm font-medium text-muted-foreground py-2">
                  {slot.displayTime}
                </div>
                {days.map((day) => {
                  const dayCourses = slot.courses[day] || [];
                  return (
                    <Card
                      key={day}
                      className={`p-2 min-h-[60px] ${
                        dayCourses.length > 0
                          ? `${getCourseColor(dayCourses[0].courseCode)} text-white`
                          : 'bg-muted/20'
                      }`}
                    >
                      {dayCourses.map((course) => (
                        <div key={course.courseCode} className="text-xs space-y-0.5 mb-1 last:mb-0">
                          <div className="font-semibold truncate">
                            {course.courseCode}
                          </div>
                          <div className="truncate opacity-90">
                            {course.subjectName}
                          </div>
                          <div className="opacity-75">{course.venue}</div>
                        </div>
                      ))}
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
