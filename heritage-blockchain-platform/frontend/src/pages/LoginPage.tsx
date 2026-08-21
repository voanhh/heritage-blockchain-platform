import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { Link } from "react-router-dom";

export function LoginPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin, loading, error } = useLogin();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    // Gọi hàm từ hook
    handleLogin(email, password);
  };



  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f7f2] px-5">
      <section className="w-full max-w-md rounded border border-stone-200 bg-white p-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          Đăng nhập
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Truy cập hệ thống quản lý di sản blockchain.
        </p>

        {error && (
          <div className="mt-4 rounded bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <input
              type="email"
              value={email}
              className="w-full rounded border border-stone-300 px-3 py-2"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              value={password}
              className="w-full rounded border border-stone-300 px-3 py-2"
              placeholder="Password" type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              className="w-full rounded bg-emerald-700 px-4 py-2 font-medium text-white"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : 'Tiếp tục'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-semibold text-emerald-700 hover:underline">
            Tạo tài khoản
          </Link>
        </div>
      </section>
    </main>
  );
}

