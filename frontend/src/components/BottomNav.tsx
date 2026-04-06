"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, MapPin, User, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Beranda', icon: Home, href: '/' },
  { label: 'Jadwal', icon: Calendar, href: '/schedules' },
  { label: 'Lokasi', icon: MapPin, href: '/locations' },
  { label: 'More', icon: MoreHorizontal, href: '/more' },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Don't show nav on login page
  if (pathname === '/login') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-dark border-t border-white/10 px-2 py-1.5 pb-safe shadow-2xl flex justify-around items-center h-16">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link 
            key={item.href} 
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all duration-300 relative rounded-xl py-1",
              isActive ? "text-secondary scale-110" : "text-white/50 hover:text-white/80"
            )}
          >
            {isActive && (
              <div className="absolute inset-x-0 bottom-[-6px] h-1 bg-secondary rounded-full shadow-[0_0_8px_rgba(214,181,117,0.5)] mx-auto w-1/3" />
            )}
            <Icon className={cn(
              "w-5 h-5",
              isActive ? "drop-shadow-[0_0_8px_rgba(214,181,117,0.4)]" : ""
            )} />
            <span className="text-[10px] font-medium tracking-tight whitespace-nowrap">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
