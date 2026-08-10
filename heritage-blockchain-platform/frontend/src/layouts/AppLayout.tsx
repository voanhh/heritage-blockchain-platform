import { Archive, Blocks, CheckCircle2, LayoutDashboard, ScrollText } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/heritages', label: 'Di sản', icon: Archive },
  { to: '/verification', label: 'Kiểm duyệt', icon: CheckCircle2 },
  { to: '/blockchain', label: 'Blockchain', icon: Blocks }
];

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[#f7f7f2]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-stone-200 bg-white px-5 py-6 md:block">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded bg-emerald-700 text-white">
            <ScrollText size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold">Heritage Blockchain</p>
            <p className="text-xs text-slate-500">Research Prototype</p>
          </div>
        </div>
        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded px-3 py-2 text-sm font-medium ${
                    isActive ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:bg-stone-100'
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <main className="md:pl-64">
        <div className="mx-auto max-w-6xl px-5 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

