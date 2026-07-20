import { useMemo, useState } from 'react';
import type { TimetableCourse } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { getSlotDescription } from '@/utils/slotMapping';
import { Search, Clock } from 'lucide-react';

interface CoursesTableProps {
  courses: TimetableCourse[];
}

export function CoursesTable({ courses }: CoursesTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return courses.filter(
      (course) =>
        course.subjectName.toLowerCase().includes(query) ||
        course.courseCode.toLowerCase().includes(query) ||
        course.faculty.toLowerCase().includes(query)
    );
  }, [courses, searchQuery]);

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">Course Details</h3>
          <div className="relative flex-1 max-w-sm ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by subject, code, or faculty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Course Code</TableHead>
              <TableHead className="text-center">Credits</TableHead>
              <TableHead>Slot</TableHead>
              <TableHead>Faculty</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead>Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses.map((course) => (
              <TableRow key={course.courseCode}>
                <TableCell className="font-medium">{course.subjectName}</TableCell>
                <TableCell>
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {course.courseCode}
                  </code>
                </TableCell>
                <TableCell className="text-center">{course.credits}</TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 cursor-help">
                        <Badge variant="outline">{course.slot}</Badge>
                        <Clock className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{getSlotDescription(course.slot)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {course.faculty}
                </TableCell>
                <TableCell>{course.venue}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {course.category}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery ? 'No courses match your search' : 'No courses available'}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
