import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@/api/courses';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, BookOpen, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Course } from '@/types';

export function CoursesPage() {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses', department],
    queryFn: async () => {
      const params = department ? { department } : undefined;
      const { data } = await coursesApi.getAll(params);
      return data.data?.courses ?? [];
    },
  });

  const filtered = courses?.filter(
    (c: Course) =>
      c.courseName.toLowerCase().includes(search.toLowerCase()) ||
      c.courseCode.toLowerCase().includes(search.toLowerCase())
  );

  const departments = [...new Set(courses?.map((c: Course) => c.department) ?? [])];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Course Catalog</h1>
            <p className="text-muted-foreground mt-1">
              Browse all available courses at VIT
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setDepartment('')}>
                  All Departments
                </DropdownMenuItem>
                {departments.map((dept) => (
                  <DropdownMenuItem key={dept} onClick={() => setDepartment(dept)}>
                    {dept}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {department && (
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="secondary">{department}</Badge>
            <Button variant="ghost" size="sm" onClick={() => setDepartment('')}>
              Clear filter
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-3 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !filtered?.length ? (
          <div className="text-center py-16">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
            <h3 className="text-lg font-medium mb-1">No courses found</h3>
            <p className="text-muted-foreground text-sm">
              {search ? 'Try adjusting your search' : 'No courses available'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course: Course, i: number) => (
              <motion.div
                key={course.courseCode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-sm">{course.courseName}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {course.courseCode}
                        </p>
                      </div>
                      <Badge variant="outline">{course.credits} cr</Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="secondary" className="text-xs">
                        {course.department}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {course.courseType}
                      </Badge>
                    </div>
                    {course.description && (
                      <p className="text-xs text-muted-foreground mt-3 line-clamp-2">
                        {course.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
