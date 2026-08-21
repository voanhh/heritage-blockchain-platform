import { useState } from 'react';
import { useRegister } from '../hooks/useRegister';
import { Link } from 'react-router-dom'; // Dùng để chuyển trang

export function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleRegister, loading, error } = useRegister();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) return;

    handleRegister(email, password, fullName);
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f7f2] px-5">
      <section className="w-full max-w-md rounded border border-stone-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Tạo tài khoản</h1>
        <p className="mt-2 text-sm text-slate-600">
          Đăng ký để tham gia hệ thống quản lý di sản.
        </p>

        {error && (
          <div className="mt-4 rounded bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              placeholder="Họ và tên"
              required
            />
          </div>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              placeholder="Địa chỉ Email"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              placeholder="Mật khẩu (ít nhất 6 ký tự)"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-emerald-700 px-4 py-2 font-medium text-white transition-colors hover:bg-emerald-800 disabled:bg-emerald-400"
          >
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-semibold text-emerald-700 hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </section>
    </main>
  );
}
