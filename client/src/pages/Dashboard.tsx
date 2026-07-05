import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { statsApi } from '@/api/stats';
import { enrollmentsApi } from '@/api/enrollments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, GraduationCap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function DashboardPage() {
  const { user } = useAuth();

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

  const statCards = [
    {
      title: 'Total Courses',
      value: statsData?.totalCourses ?? 0,
      icon: BookOpen,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'Total Students',
      value: statsData?.totalStudents ?? 0,
      icon: Users,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      title: 'Enrollments',
      value: statsData?.totalEnrollments ?? 0,
      icon: GraduationCap,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      title: 'My CGPA',
      value: enrollmentsData?.cgpa?.toFixed(2) ?? '—',
      icon: TrendingUp,
      color: 'text-destructive',
      bg: 'bg-destructive/10',
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
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
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
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
