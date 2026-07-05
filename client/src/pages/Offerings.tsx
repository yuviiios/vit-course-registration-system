import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { offeringsApi } from '@/api/offerings';
import { enrollmentsApi } from '@/api/enrollments';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Search, BookOpen, Clock, MapPin, User, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { CourseOffering } from '@/types';

export function OfferingsPage() {
  const [search, setSearch] = useState('');
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: offerings, isLoading } = useQuery({
    queryKey: ['available-offerings'],
    queryFn: async () => {
      const { data } = await offeringsApi.getAvailable();
      return data.data?.offerings ?? [];
    },
  });

  const enrollMutation = useMutation({
    mutationFn: (offeringId: string) =>
      enrollmentsApi.enroll(user!.studentId, offeringId),
    onSuccess: () => {
      toast.success('Successfully enrolled!');
      queryClient.invalidateQueries({ queryKey: ['available-offerings'] });
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to enroll';
      toast.error(message);
    },
  });

  const filtered = offerings?.filter(
    (o: CourseOffering) =>
      o.courseDetails?.courseName?.toLowerCase().includes(search.toLowerCase()) ||
      o.courseCode.toLowerCase().includes(search.toLowerCase()) ||
      o.facultyName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Available Courses</h1>
            <p className="text-muted-foreground mt-1">
              Register for courses with available seats
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search offerings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !filtered?.length ? (
          <div className="text-center py-16">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
            <h3 className="text-lg font-medium mb-1">No offerings available</h3>
            <p className="text-muted-foreground text-sm">
              {search ? 'Try adjusting your search' : 'Check back later for new offerings'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((offering: CourseOffering, i: number) => (
              <motion.div
                key={offering.offeringId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-sm">
                          {offering.courseDetails?.courseName || offering.courseCode}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {offering.courseCode} • {offering.credits} credits
                        </p>
                      </div>
                      <Badge
                        variant={offering.availableSeats > 10 ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {offering.availableSeats} seats
                      </Badge>
                    </div>

                    <div className="space-y-2 mt-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5" />
                        <span>{offering.facultyName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{offering.slot}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{offering.venue}</span>
                      </div>
                    </div>

                    {isAuthenticated && (
                      <Button
                        className="w-full mt-4"
                        size="sm"
                        onClick={() => enrollMutation.mutate(offering.offeringId)}
                        disabled={enrollMutation.isPending}
                      >
                        {enrollMutation.isPending ? (
                          <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                        ) : null}
                        Enroll Now
                      </Button>
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
