"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Lock, Eye, EyeOff, AlertCircle, Loader2, LogIn } from 'lucide-react';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [kodeUser, setKodeUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/login', {
        kode_user: kodeUser,
        password: password,
      });

      const { access_token, user } = response.data;
      
      // Save token and user info
      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect to dashboard
      router.push('/');
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const errorData = (err as { response: { data: { message?: string } } }).response.data;
        setError(errorData.message || 'Login gagal. Cek kembali Kode User dan Password.');
      } else {
        setError('Terjadi kesalahan pada server. Silakan coba lagi nanti.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)] overflow-hidden relative">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px] opacity-20 dark:opacity-5" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px] opacity-10 dark:opacity-5" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-48 h-20 rounded-2xl mb-4 overflow-hidden px-4">
            <Image 
              src="/assets/logo-rak.png" 
              alt="Logo RAK" 
              width={160} 
              height={50} 
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight uppercase maroon-gradient-text dark:gold-text">RAKSI</h1>
          <p className="text-accent text-sm mt-1">Sistem Kunjungan Petugas Lapangan</p>
        </div>

        <div className="glass-dark p-8 rounded-3xl space-y-6 border border-white/10">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-danger/10 border border-danger/20 p-3 rounded-xl flex items-center gap-3 text-danger text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-accent uppercase tracking-wider ml-1">Kode User</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent group-focus-within:text-secondary transition-colors" />
                <input
                  type="text"
                  value={kodeUser}
                  onChange={(e) => setKodeUser(e.target.value.toUpperCase())}
                  placeholder="MASUKKAN KODE USER"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-secondary/50 focus:ring-4 focus:ring-secondary/5 transition-all placeholder:text-white/20 uppercase"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-accent uppercase tracking-wider ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent group-focus-within:text-secondary transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-12 text-white focus:outline-none focus:border-secondary/50 focus:ring-4 focus:ring-secondary/5 transition-all placeholder:text-white/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-accent hover:text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full maroon-gradient py-4 rounded-2xl text-white font-bold shadow-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all border border-white/10",
                  isLoading && "opacity-70 cursor-not-allowed"
                )}
              >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>MASUK SEKARANG</span>
                  <LogIn className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </form>
          
          <div className="text-center pt-2">
            <p className="text-white/30 text-[10px] uppercase tracking-[0.2em]">Developed by PT. Royal Ananta Kirtya</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
