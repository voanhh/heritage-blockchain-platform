import { Archive, Blocks, CheckCircle2, ChevronLeft, LayoutDashboard, Menu, ScrollText } from 'lucide-react';
import { Navigate, NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Sidebar } from '../components/layout/SideBar';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/heritages', label: 'Di sản', icon: Archive },
  { to: '/verification', label: 'Kiểm duyệt', icon: CheckCircle2 },
  { to: '/blockchain', label: 'Blockchain', icon: Blocks }
];

export function AppLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Bảo vệ Route: Nếu chưa đăng nhập thì đá về trang login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f7f2]">

      {/* Sidebar: Dùng absolute/fixed kết hợp translate để trượt */}
      <aside
        className={`relative z-40 h-full w-64 flex-shrink-0 border-r border-stone-200 bg-white transition-[margin-left] duration-300 ease-in-out ${isSidebarOpen ? 'ml-0' : '-ml-64'
          }`}
      >
        <Sidebar />

        {/* Nút Toggle hình tròn gắn liền ở mép phải của Sidebar */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-4 top-[5%] z-50 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-stone-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-stone-50 hover:text-emerald-700 focus:outline-none"
          title={isSidebarOpen ? 'Thu gọn' : 'Mở rộng'}
        >
          <ChevronLeft
            size={18}
            className={`transition-transform duration-300 ${!isSidebarOpen ? 'rotate-180' : ''
              }`}
          />
        </button>
      </aside>

      {/* Content chính bên phải */}
      <main className="flex flex-1 flex-col overflow-hidden w-full transition-all duration-300">


        {/* Vùng hiển thị các trang (Dashboard, Di sản...) */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </div>

      </main>
    </div>
  );
}

