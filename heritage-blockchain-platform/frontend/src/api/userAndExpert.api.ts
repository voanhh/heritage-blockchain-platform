import { UserRole } from '../types/rbac';
import axiosClient from './axiosClient'; // Tùy chỉnh theo axios instance của dự án bạn

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  organization?: { name: string };
  createdAt: string;
}

export interface Specialization {
  id: string;
  code: string;
  name: string;
}

export const userAndExpertApi = {
  // 1. Lấy danh sách người dùng (có phân trang & search)
  getUsers: (params: { page?: number; limit?: number; search?: string; role?: string }) => {
    return axiosClient.get<{ success: boolean; data: User[]; total: number }>('/users', { params });
  },

  // 2. Lấy danh sách chuyên môn để chọn
  getSpecializations: () => {
    return axiosClient.get<{ success: boolean; data: Specialization[] }>('/specializations');
  },

  // 3. Gọi API Bổ nhiệm / Cập nhật Expert
  assignExpert: (data: { targetUserId: string; specializationIds: string[] }) => {
    return axiosClient.post('/experts/admin/assign', data);
  },

  // 4. Gọi API Cắt chức Expert
  revokeExpert: (targetUserId: string) => {
    return axiosClient.delete(`/experts/admin/revoke/${targetUserId}`);
  },
};
