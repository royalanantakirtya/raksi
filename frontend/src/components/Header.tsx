"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { LogOut, User as UserIcon } from 'lucide-react';

export default function Header() {
  const [userName, setUserName] = useState('Petugas');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.nama_user || 'Petugas');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (pathname === '/login') return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 maroon-gradient text-white px-4 py-3 shadow-lg flex justify-between items-center h-16">
      <div className="flex items-center gap-3">
        <div className="bg-white/10 p-1.5 rounded-xl border border-white/10">
          <Image 
            src="/assets/logo-rak.png" 
            alt="Logo RAK" 
            width={32} 
            height={32} 
            className="object-contain filter brightness-0 invert"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm font-bold tracking-tight gold-text">RAKSI</h1>
          <p className="text-[10px] text-accent uppercase tracking-widest hidden sm:block">Royal Ananta Kirtya</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden xs:block">
          <p className="text-[10px] text-white/60 uppercase tracking-wider">Selamat Datang</p>
          <p className="text-xs font-semibold">{userName}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
            <UserIcon className="w-4 h-4 text-secondary" />
          </div>
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
