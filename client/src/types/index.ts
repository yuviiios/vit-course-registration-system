export interface Student {
  _id?: string;
  studentId: string;
  registrationNumber: string;
  name: string;
  email: string;
  branch: string;
  semester?: number;
  role?: string;
  googleId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Course {
  _id?: string;
  courseCode: string;
  courseName: string;
  credits: number;
  department: string;
  courseType: string;
  maxCapacity: number;
  description?: string;
  prerequisites?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseOffering {
  _id?: string;
  offeringId: string;
  courseCode: string;
  facultyId: string;
  facultyName: string;
  semester: string;
  academicYear: string;
  slot: string;
  venue: string;
  maxCapacity: number;
  availableSeats: number;
  enrolledCount: number;
  credits: number;
  courseDetails?: Course;
  createdAt?: string;
  updatedAt?: string;
}

export interface Enrollment {
  _id?: string;
  enrollmentId: string;
  studentId: string;
  offeringId: string;
  courseCode: string;
  courseName?: string;
  facultyName?: string;
  slot?: string;
  venue?: string;
  status: 'Enrolled' | 'Dropped' | 'Completed';
  internalMarks?: number;
  finalMarks?: number;
  totalMarks?: number;
  grade?: string;
  enrolledAt?: string;
}

export interface Faculty {
  _id?: string;
  facultyId: string;
  name: string;
  email: string;
  department: string;
  designation?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalEnrollments: number;
  totalFaculty: number;
  departmentDistribution?: Record<string, number>;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  registrationNumber: string;
  name: string;
  email: string;
  password: string;
  branch: string;
  semester?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}
