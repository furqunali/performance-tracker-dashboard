import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  List,
  Settings,
  Menu,
  X,
  Activity,
} from 'lucide-react';
import { useStore, store } from '../data/store.js';
import { ORG_NAME } from '../data/seed.js';

const NAV = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, adminOnly: false },
  { name: 'Submit Report', href: '/submit-report', icon: FileText, adminOnly: false },
  { name: 'My Reports', href: '/my-reports', icon: List, adminOnly: false },
  { name: 'Admin Settings', href: '/admin-settings', icon: Settings, adminOnly: true },
];

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const user = useStore((s) => s.user);
  const isAdmin = user.role === 'admin';

  const items = NAV.filter((i) => !i.adminOnly || isAdmin);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <nav className="bg-navy-800 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-md">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold leading-tight">{ORG_NAME}</h1>
                <p className="text-[11px] text-brand-100/80 tracking-wide">
                  Performance Tracker
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-1">
              {items.map((item) => {
                const active = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? 'bg-brand-500 text-white shadow'
                        : 'text-slate-200 hover:bg-navy-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <RoleToggle role={user.role} />
              <div className="hidden sm:block text-right leading-tight">
                <p className="text-sm font-semibold">{user.full_name}</p>
                <p className="text-[11px] text-slate-300 capitalize">{user.role}</p>
              </div>
              <button
                onClick={() => setOpen(!open)}
                className="md:hidden p-2 rounded-lg hover:bg-navy-700"
                aria-label="Toggle menu"
              >
                {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t border-navy-700 bg-navy-800">
            <div className="px-4 py-3 space-y-1">
              {items.map((item) => {
                const active = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                      active ? 'bg-brand-500 text-white' : 'text-slate-200 hover:bg-navy-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1">{children}</main>

      <footer className="bg-navy-800 text-slate-300 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-center text-xs">
          {ORG_NAME} · Performance Tracker — demo application with sample data.
        </div>
      </footer>
    </div>
  );
}

// Lets a viewer flip between Admin and Manager to explore role-gated views.
function RoleToggle({ role }) {
  const next = role === 'admin' ? 'manager' : 'admin';
  return (
    <button
      onClick={() => store.setRole(next)}
      title="Demo: switch role"
      className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-navy-700 text-brand-100 hover:bg-navy-600 transition-colors"
    >
      <span className={`w-2 h-2 rounded-full ${role === 'admin' ? 'bg-brand-400' : 'bg-amber-400'}`} />
      View as {role === 'admin' ? 'Admin' : 'Manager'}
    </button>
  );
}
