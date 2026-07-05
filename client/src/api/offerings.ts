import client from './client';
import type { ApiResponse, CourseOffering } from '@/types';

export const offeringsApi = {
  getAvailable: (params?: { semester?: string; academicYear?: string; department?: string }) =>
    client.get<ApiResponse<{ offerings: CourseOffering[] }>>('/offerings/available', { params }),

  getById: (id: string) =>
    client.get<ApiResponse<{ offering: CourseOffering }>>(`/offerings/${id}`),

  create: (data: Partial<CourseOffering>) =>
    client.post<ApiResponse<{ offering: CourseOffering }>>('/offerings', data),

  update: (id: string, data: Partial<CourseOffering>) =>
    client.put<ApiResponse<void>>(`/offerings/${id}`, data),

  delete: (id: string) =>
    client.delete<ApiResponse<void>>(`/offerings/${id}`),
};
