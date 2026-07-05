import client from './client';
import type { ApiResponse, Enrollment } from '@/types';

export const enrollmentsApi = {
  enroll: (studentId: string, offeringId: string) =>
    client.post<ApiResponse<{ enrollment: Enrollment }>>('/enrollments/enroll', {
      studentId,
      offeringId,
    }),

  drop: (enrollmentId: string) =>
    client.post<ApiResponse<void>>(`/enrollments/${enrollmentId}/drop`),

  getStudentEnrollments: (studentId: string, params?: { status?: string }) =>
    client.get<ApiResponse<{ enrollments: Enrollment[]; cgpa: number }>>(
      `/enrollments/student/${studentId}`,
      { params }
    ),

  getCourseEnrollments: (courseCode: string, params?: { status?: string }) =>
    client.get<ApiResponse<{ count: number; enrollments: Enrollment[] }>>(
      `/enrollments/course/${courseCode}/students`,
      { params }
    ),

  updateGrade: (enrollmentId: string, internalMarks: number, finalMarks: number) =>
    client.put<ApiResponse<{ grade: string; totalMarks: number; cgpa: number }>>(
      `/enrollments/${enrollmentId}/grade`,
      { internalMarks, finalMarks }
    ),
};
