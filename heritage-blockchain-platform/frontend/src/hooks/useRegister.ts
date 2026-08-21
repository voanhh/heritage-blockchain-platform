import { useState } from 'react';
import { authApi } from '../api/auth.api';
import { useNavigate } from 'react-router-dom';

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (email: string, passwordRaw: string, fullName: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.register({ email, passwordRaw, fullName });

      console.log('Register success:', data);

      // Đăng ký xong backend đã trả token, nên có thể cho vào luôn dashboard
      navigate('/dashboard');
    } catch (err: any) {
      // Bắt lỗi từ backend (ví dụ: EMAIL_IS_ALREADY_IN_USE)
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return { handleRegister, loading, error };
}
