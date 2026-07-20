import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentsApi } from '@/api/enrollments';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Trash2, Loader2, Calendar, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Enrollment } from '@/types';
import { useTimetableData, getActiveCourses, mergeCourses } from '@/hooks/useTimetableData';
import { getSlotDescription } from '@/utils/slotMapping';

export function MyCoursesPage() {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { courses: vtopCourses, hasData: hasVtopData } = useTimetableData();

  const { data, isLoading } = useQuery({
    queryKey: ['my-enrollments', user?.studentId],
    queryFn: async () => {
      if (!user?.studentId) return null;
      const { data } = await enrollmentsApi.getStudentEnrollments(user.studentId);
      return data.data;
    },
    enabled: !!user?.studentId,
  });

  const dropMutation = useMutation({
    mutationFn: (enrollmentId: string) => enrollmentsApi.drop(enrollmentId),
    onSuccess: () => {
      toast.success('Course dropped successfully');
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to drop course';
      toast.error(message);
    },
  });

  const enrollments = data?.enrollments ?? [];
  const cgpa = data?.cgpa;
  const activeCourses = getActiveCourses(vtopCourses);
  const merged = mergeCourses(enrollments, activeCourses);

  const statusColor = (status: string) => {
    switch (status) {
      case 'Enrolled':
        return 'default';
      case 'Completed':
        return 'secondary';
      case 'Dropped':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
            <p className="text-muted-foreground mt-1">
              {user?.cgpa != null && user.cgpa > 0 && `CGPA: ${user.cgpa.toFixed(2)} • `}
              {merged.length} course{merged.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button asChild>
            <Link to="/offerings">Register More</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-5 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !enrollments.length && !hasVtopData ? (
          <Card>
            <CardContent className="text-center py-16">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
              <h3 className="text-lg font-medium mb-1">No courses yet</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Start by browsing available courses
              </p>
              <Button asChild>
                <Link to="/offerings">Browse Courses</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue={hasVtopData ? "all" : "enrolled"} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Courses ({merged.length})</TabsTrigger>
              <TabsTrigger value="enrolled">System Enrolled ({enrollments.length})</TabsTrigger>
              {hasVtopData && (
                <TabsTrigger value="vtop">
                  <Calendar className="mr-1 h-3 w-3" />
                  VTOP ({activeCourses.length})
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="all" className="space-y-3">
              {merged.map((item, i) => (
                <motion.div
                  key={item.courseCode}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                >
                  <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">
                              {item.vtopData?.subjectName || (item as any).courseName || item.courseCode}
                            </p>
                            {item.source === 'vtop' && (
                              <Badge variant="outline" className="text-xs">
                                <Calendar className="mr-1 h-2.5 w-2.5" />
                                VTOP
                              </Badge>
                            )}
                            {item.source === 'both' && (
                              <Badge variant="default" className="text-xs">Synced</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-xs text-muted-foreground">{item.courseCode}</span>
                            {item.vtopData && (
                              <>
                                <span className="text-xs text-muted-foreground">
                                  • {item.vtopData.slot}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  • {item.vtopData.venue}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  • {item.vtopData.faculty}
                                </span>
                              </>
                            )}
                            {item.source === 'backend' && (item as any).grade && (
                              <Badge variant="outline" className="text-xs">
                                {(item as any).grade}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {item.source !== 'vtop' && (item as any).status && (
                          <Badge variant={statusColor((item as any).status) as "default" | "secondary" | "destructive" | "outline"}>
                            {(item as any).status}
                          </Badge>
                        )}
                        {item.source !== 'vtop' && (item as any).status === 'Enrolled' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => dropMutation.mutate((item as any).enrollmentId)}
                            disabled={dropMutation.isPending}
                          >
                            {dropMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="enrolled" className="space-y-3">
              {enrollments.map((enrollment: Enrollment, i: number) => (
              <motion.div
                key={enrollment.enrollmentId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                <Card>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {enrollment.courseName || enrollment.courseCode}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground">
                            {enrollment.courseCode}
                          </span>
                          {enrollment.slot && (
                            <span className="text-xs text-muted-foreground">
                              • {enrollment.slot}
                            </span>
                          )}
                          {enrollment.grade && (
                            <Badge variant="outline" className="text-xs">
                              {enrollment.grade}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={statusColor(enrollment.status) as "default" | "secondary" | "destructive" | "outline"}>
                        {enrollment.status}
                      </Badge>
                      {enrollment.status === 'Enrolled' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => dropMutation.mutate(enrollment.enrollmentId)}
                          disabled={dropMutation.isPending}
                        >
                          {dropMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
                </motion.div>
              ))}
            </TabsContent>

            {hasVtopData && (
              <TabsContent value="vtop" className="space-y-3">
                {activeCourses.map((course, i) => (
                  <motion.div
                    key={course.courseCode}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                  >
                    <Card>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{course.subjectName}</p>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <span className="text-xs text-muted-foreground">{course.courseCode}</span>
                              <span className="text-xs text-muted-foreground">• {course.slot}</span>
                              <span className="text-xs text-muted-foreground">• {course.venue}</span>
                              <span className="text-xs text-muted-foreground">• {course.faculty}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {getSlotDescription(course.slot)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{course.credits} Credits</Badge>
                          <Badge variant="secondary" className="text-xs">{course.courseType}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </TabsContent>
            )}
          </Tabs>
        )}
      </motion.div>
    </div>
  );
}
