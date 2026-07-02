'use client';
import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { FiMenu, FiX, FiHome, FiUpload, FiBriefcase, FiGrid, FiBookOpen, FiMessageSquare, FiDollarSign, FiAward, FiFileText, FiUser, FiLogOut, FiBell, FiTrendingUp, FiCalendar } from 'react-icons/fi';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: FiHome },
  { href: '/resume', label: 'Resume', icon: FiUpload },
  { href: '/jobs', label: 'Job Descriptions', icon: FiBriefcase },
  { href: '/skills', label: 'Skills Library', icon: FiGrid },
  { href: '/match', label: 'Skill Match', icon: FiTrendingUp },
  { href: '/roadmap', label: 'Learning Roadmap', icon: FiBookOpen },
  { href: '/interview', label: 'Interview Prep', icon: FiMessageSquare },
  { href: '/salary', label: 'Salary Insights', icon: FiDollarSign },
  { href: '/certificates', label: 'Certificates', icon: FiAward },
  { href: '/reports', label: 'Reports', icon: FiFileText },
  { href: '/profile', label: 'Profile', icon: FiUser },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password' || pathname === '/';

  if (isAuthPage) return <>{children}</>;

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b bg-gradient-to-r from-blue-600 to-indigo-700">
          <Link href="/dashboard" className="text-xl font-bold text-white">SkillBridge AI</Link>
          <button onClick={() => setSidebarOpen(false)} className="text-white lg:hidden"><FiX size={24} /></button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${active ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
                onClick={() => setSidebarOpen(false)}>
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <button onClick={logout} className="flex items-center gap-3 px-2 py-2 w-full text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <FiLogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-500 lg:hidden"><FiMenu size={24} /></button>
          <div className="flex items-center gap-4 ml-auto">
            <Link href="/notifications" className="text-gray-400 hover:text-gray-600 relative">
              <FiBell size={20} />
            </Link>
            <span className="text-sm text-gray-600">{user?.name || user?.email}</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-medium">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>

      {sidebarOpen && <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}
