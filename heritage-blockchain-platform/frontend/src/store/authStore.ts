// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Định nghĩa kiểu dữ liệu cho User (Dựa theo backend của bạn)
export interface UserData {
  id: string;
  fullName: string;
  email: string;
  role: string;
  organizationId?: string;
}

interface AuthState {
  user: UserData | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  // Các hàm (actions) để thay đổi state
  setAuth: (user: UserData, accessToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,


      setAuth: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),


      clearAuth: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: 'heritage-auth-storage', // Tên key sẽ lưu trong localStorage
      // Có thể lọc chỉ lưu 'user' và 'isAuthenticated' vào localStorage,
      // còn 'accessToken' thì không lưu để tăng tính bảo mật (tuỳ chọn)
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);
