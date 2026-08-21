import { useState } from 'react';
import { authApi } from '../api/auth.api';
import { useNavigate } from 'react-router-dom';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (email: string, passwordRaw: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.login({ email, passwordRaw });

      // TODO: Lưu accessToken vào global state (Zustand / Redux / Context)
      console.log('Login success:', data);


      navigate('/dashboard');
    } catch (err: any) {
      // Bắt lỗi từ backend (ví dụ: INVALID_CREDENTIALS)
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error };
}
