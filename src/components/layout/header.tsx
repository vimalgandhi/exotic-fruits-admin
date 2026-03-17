'use client';

import { LogOut, User, Bell } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';

interface HeaderProps {
  title?: string;
}

export default function Header({ title }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
      <div>
        {title && <h1 className="text-xl font-semibold text-gray-900">{title}</h1>}
      </div>

      <div className="flex items-center gap-3">
        <button
          className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
            <User className="h-4 w-4 text-green-700" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{user?.name ?? 'Admin'}</p>
            <p className="text-xs text-gray-500">{user?.role ?? 'admin'}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="ml-1">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
