import client from './client';
import type { ApiResponse, DashboardStats } from '@/types';

export const statsApi = {
  getDashboard: () =>
    client.get<ApiResponse<{ stats: DashboardStats }>>('/stats/dashboard'),

  getDepartmentStats: (department: string) =>
    client.get<ApiResponse<{ stats: unknown }>>(`/stats/department/${department}`),

  getEnrollmentTrends: (academicYear?: string) =>
    client.get<ApiResponse<{ trends: unknown }>>('/stats/enrollment-trends', {
      params: { academicYear },
    }),

  getTopPerformers: (limit?: number) =>
    client.get<ApiResponse<{ performers: unknown }>>('/stats/top-performers', {
      params: { limit },
    }),
};
