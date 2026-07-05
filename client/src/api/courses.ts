import client from './client';
import type { ApiResponse, Course } from '@/types';

export const coursesApi = {
  getAll: (params?: { department?: string; courseType?: string }) =>
    client.get<ApiResponse<{ courses: Course[] }>>('/courses', { params }),

  getByCode: (code: string) =>
    client.get<ApiResponse<{ course: Course }>>(`/courses/${code}`),

  create: (data: Partial<Course>) =>
    client.post<ApiResponse<{ course: Course }>>('/courses', data),

  update: (code: string, data: Partial<Course>) =>
    client.put<ApiResponse<void>>(`/courses/${code}`, data),

  delete: (code: string) =>
    client.delete<ApiResponse<void>>(`/courses/${code}`),
};
