import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { statsApi } from '@/api/stats';
import { enrollmentsApi } from '@/api/enrollments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, GraduationCap, TrendingUp, Calendar, Upload, Award, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTimetableData, getActiveCourses } from '@/hooks/useTimetableData';
import { EditCredits } from '@/components/dashboard/EditCredits';
import { EditCGPA } from '@/components/dashboard/EditCGPA';

export function DashboardPage() {
  const { user } = useAuth();
  const { courses: vtopCourses, stats: vtopStats, hasData: hasVtopData } = useTimetableData();

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await statsApi.getDashboard();
      return data.data?.stats;
    },
  });

  const { data: enrollmentsData, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['my-enrollments', user?.studentId],
    queryFn: async () => {
      if (!user?.studentId) return null;
      const { data } = await enrollmentsApi.getStudentEnrollments(user.studentId);
      return data.data;
    },
    enabled: !!user?.studentId,
  });

  const totalCreditsRequired = user?.totalCreditsRequired ?? 162;
  const earnedCredits = user?.earnedCredits ?? 0;
  const currentCgpa = user?.cgpa ?? 0;

  const statCards = [
    {
      title: 'Total Credits Required',
      value: totalCreditsRequired,
      icon: Target,
      color: 'text-primary',
      bg: 'bg-primary/10',
      editType: null,
    },
    {
      title: 'Earned Credits',
      value: earnedCredits.toFixed(1),
      icon: Award,
      color: 'text-success',
      bg: 'bg-success/10',
      editType: 'credits',
      currentValue: earnedCredits,
    },
    {
      title: 'Current CGPA',
      value: currentCgpa.toFixed(2),
      icon: TrendingUp,
      color: 'text-warning',
      bg: 'bg-warning/10',
      editType: 'cgpa',
      currentValue: currentCgpa,
    },
    {
      title: 'Remaining Credits',
      value: Math.max(0, totalCreditsRequired - earnedCredits),
      icon: GraduationCap,
      color: 'text-destructive',
      bg: 'bg-destructive/10',
      editType: null,
    },
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's an overview of your academic progress
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  {statsLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground">{stat.title}</p>
                          {stat.editType === 'credits' && (
                            <EditCredits currentValue={stat.currentValue!} />
                          )}
                          {stat.editType === 'cgpa' && (
                            <EditCGPA currentValue={stat.currentValue!} />
                          )}
                        </div>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {hasVtopData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">VTOP Timetable Imported</CardTitle>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/upload-timetable">View Schedule</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-primary">{vtopStats?.totalCourses}</p>
                    <p className="text-xs text-muted-foreground">Total Courses</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{vtopStats?.theoryCourses}</p>
                    <p className="text-xs text-muted-foreground">Theory</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{vtopStats?.labCourses}</p>
                    <p className="text-xs text-muted-foreground">Labs</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{vtopStats?.totalCredits}</p>
                    <p className="text-xs text-muted-foreground">Credits</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">My Enrolled Courses</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/my-courses">View all</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {enrollmentsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : !enrollmentsData?.enrollments?.length ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p>No courses enrolled yet</p>
                  <Button variant="link" asChild className="mt-2">
                    <Link to="/offerings">Browse available courses</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {enrollmentsData.enrollments.slice(0, 5).map((enrollment) => (
                    <div
                      key={enrollment.enrollmentId}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium text-sm">{enrollment.courseName || enrollment.courseCode}</p>
                        <p className="text-xs text-muted-foreground">
                          {enrollment.slot} • {enrollment.venue}
                        </p>
                      </div>
                      <Badge
                        variant={enrollment.status === 'Enrolled' ? 'default' : 'secondary'}
                      >
                        {enrollment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/offerings">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse Available Courses
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/courses">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Course Catalog
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/profile">
                  <Users className="mr-2 h-4 w-4" />
                  View Profile
                </Link>
              </Button>
              {!hasVtopData && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/upload-timetable">
                    <Upload className="mr-2 h-4 w-4" />
                    Import VTOP Timetable
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
