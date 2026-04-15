"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { LogOut, User as UserIcon } from 'lucide-react';

export default function Header() {
  const [userName] = useState(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData && userData !== 'undefined') {
        try {
          const user = JSON.parse(userData);
          if (user && typeof user === 'object' && 'nama_user' in user) {
            return user.nama_user || 'Petugas';
          }
        } catch (err) {
          console.error('Failed to parse user data:', err);
        }
      }
    }
    return 'Petugas';
  });

  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (pathname === '/login') return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-primary text-white px-4 py-3 shadow-lg flex justify-between items-center h-16">
      <div className="flex items-center gap-3">
        <div className="bg-white p-1 rounded-sm w-24 h-10 flex items-center justify-center">
          <Image 
            src="/assets/logo-rak.png" 
            alt="Logo RAK" 
            width={80} 
            height={24} 
            className="object-contain"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden xs:block">
          <p className="text-[10px] text-white/50 uppercase tracking-wider">Selamat Datang</p>
          <p className="text-xs font-black uppercase tracking-tight">{userName}</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => router.push('/more')}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all active:scale-90"
            title="Profil & Lainnya"
          >
            <UserIcon className="w-5 h-5 text-secondary" />
          </button>
          <button 
            onClick={handleLogout}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-white"
            title="Keluar"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
