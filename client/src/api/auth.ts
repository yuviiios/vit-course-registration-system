import client from './client';
import type { ApiResponse, AuthTokens, LoginCredentials, RegisterData, Student } from '@/types';

export const authApi = {
  login: (credentials: LoginCredentials) =>
    client.post<ApiResponse<AuthTokens>>('/auth/login', credentials),

  register: (data: RegisterData) =>
    client.post<ApiResponse<AuthTokens>>('/auth/register', data),

  getProfile: () =>
    client.get<ApiResponse<{ student: Student }>>('/auth/me'),

  updateProfile: (data: Partial<Student>) =>
    client.put<ApiResponse<{ student: Student }>>('/auth/me', data),

  refresh: (refreshToken: string) =>
    client.post<ApiResponse<AuthTokens>>('/auth/refresh', { refreshToken }),

  logout: () =>
    client.post('/auth/logout'),
};
