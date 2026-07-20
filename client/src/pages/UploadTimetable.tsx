import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TimetableCourse, TimetableStats } from '@/types';
import { parseTimetable, calculateStats } from '@/utils/timetableParser';
import { WeeklyView } from '@/components/timetable/WeeklyView';
import { CoursesTable } from '@/components/timetable/CoursesTable';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Upload,
  CheckCircle,
  AlertCircle,
  Trash2,
  BookOpen,
  Clock,
  Award,
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';

const STORAGE_KEY = 'vit_timetable_data';

export function UploadTimetablePage() {
  const [inputText, setInputText] = useState('');
  const [courses, setCourses] = useState<TimetableCourse[]>([]);
  const [stats, setStats] = useState<TimetableStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState('');
  const toast = useToast();

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setCourses(data.courses || []);
        setStats(data.stats || null);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save to localStorage when courses change
  useEffect(() => {
    if (courses.length > 0 && stats) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ courses, stats }));
    }
  }, [courses, stats]);

  const handleImport = async () => {
    if (!inputText.trim()) {
      setError('Please paste your timetable text');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate loading steps
      setLoadingStep('Reading Courses...');
      await new Promise((resolve) => setTimeout(resolve, 500));

      const parsed = parseTimetable(inputText);

      if (parsed.length === 0) {
        setError(
          'Unable to parse timetable. Please ensure you copied the timetable from VTOP exactly as instructed.'
        );
        setIsLoading(false);
        return;
      }

      setLoadingStep('Extracting Faculty...');
      await new Promise((resolve) => setTimeout(resolve, 400));

      setLoadingStep('Generating Weekly Schedule...');
      await new Promise((resolve) => setTimeout(resolve, 400));

      const courseStats = calculateStats(parsed);

      setCourses(parsed);
      setStats(courseStats);
      setInputText('');
      toast.success(`Successfully imported ${parsed.length} courses`);
    } catch (err) {
      setError('An error occurred while parsing the timetable');
      console.error(err);
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleClear = () => {
    setCourses([]);
    setStats(null);
    setInputText('');
    localStorage.removeItem(STORAGE_KEY);
    toast.success('Timetable cleared');
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload Timetable</h1>
          <p className="text-muted-foreground">
            Import your registered VTOP timetable by simply copying and pasting the
            timetable text.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {courses.length === 0 ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Tutorial Section */}
              <Card>
                <CardHeader>
                  <CardTitle>How to Copy Your Timetable</CardTitle>
                  <CardDescription>Follow these simple steps</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img
                    src="/tutorials/copying_timetable.gif"
                    alt="How to copy timetable from VTOP"
                    className="rounded-lg overflow-hidden shadow-md w-full"
                  />

                  <ol className="space-y-2 list-decimal list-inside text-sm">
                    <li>Go to the Time Table tab on VTOP.</li>
                    <li>Scroll until the complete course list is visible.</li>
                    <li>
                      Select everything from "Sl.No" (top left) to "Registered and
                      Approved" (bottom right).
                    </li>
                    <li>Press Ctrl + C.</li>
                    <li>Paste the copied text below.</li>
                    <li>Click Import Timetable.</li>
                  </ol>
                </CardContent>
              </Card>

              {/* Paste Area */}
              <Card>
                <CardHeader>
                  <CardTitle>Paste Timetable Text</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Paste your copied VTOP timetable here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                  />

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-destructive text-sm"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </motion.div>
                  )}

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-primary"
                    >
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <span className="text-sm">{loadingStep}</span>
                    </motion.div>
                  )}

                  <Button
                    onClick={handleImport}
                    disabled={!inputText.trim() || isLoading}
                    className="w-full"
                    size="lg"
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    Import Timetable
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Success Banner */}
              <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-green-900 dark:text-green-100">
                          Successfully Imported
                        </h3>
                        <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                          Imported {stats?.totalCourses} courses
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleClear}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear Timetable
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats?.theoryCourses}</p>
                        <p className="text-xs text-muted-foreground">Theory Courses</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats?.labCourses}</p>
                        <p className="text-xs text-muted-foreground">Lab Courses</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                        <Award className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats?.projectCourses}</p>
                        <p className="text-xs text-muted-foreground">Projects</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats?.totalCredits}</p>
                        <p className="text-xs text-muted-foreground">Total Credits</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs for Table and Weekly View */}
              <Tabs defaultValue="table" className="w-full">
                <TabsList>
                  <TabsTrigger value="table">Course Details</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly Timetable</TabsTrigger>
                </TabsList>

                <TabsContent value="table" className="mt-6">
                  <CoursesTable courses={courses} />
                </TabsContent>

                <TabsContent value="weekly" className="mt-6">
                  <WeeklyView courses={courses} />
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
