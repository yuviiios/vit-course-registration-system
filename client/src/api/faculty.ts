import client from './client';
import type { ApiResponse, Faculty } from '@/types';

export const facultyApi = {
  getAll: () =>
    client.get<ApiResponse<{ faculty: Faculty[] }>>('/faculty'),

  getById: (id: string) =>
    client.get<ApiResponse<{ faculty: Faculty }>>(`/faculty/${id}`),

  create: (data: Partial<Faculty>) =>
    client.post<ApiResponse<{ faculty: Faculty }>>('/faculty', data),

  update: (id: string, data: Partial<Faculty>) =>
    client.put<ApiResponse<void>>(`/faculty/${id}`, data),

  delete: (id: string) =>
    client.delete<ApiResponse<void>>(`/faculty/${id}`),
};
