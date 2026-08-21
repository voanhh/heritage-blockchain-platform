// src/hooks/useAuthInit.ts
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { axiosClient } from '../api/axiosClient';

export function useAuthInit() {
  const [isInitializing, setIsInitializing] = useState(true);
  const { setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    const initSession = async () => {
      try {
        // Tự động gửi HttpOnly Cookie chứa Refresh Token lên backend
        const response = await axiosClient.post('/auth/refresh');
        const { accessToken, userData } = response.data;

        // Khôi phục lại State trên RAM của Zustand
        setAuth(userData, accessToken);
      } catch (error) {
        // Nếu Token hết hạn hoặc không có cookie, xóa sạch state
        clearAuth();
      } finally {
        setIsInitializing(false);
      }
    };

    initSession();
  }, []);

  return { isInitializing };
}
