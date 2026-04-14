"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

function getStoredUser() {
  try {
    const token = localStorage.getItem("auth_token");
    const userData = localStorage.getItem("user");
    if (!token || !userData) return null;
    return JSON.parse(userData);
  } catch {
    return null;
  }
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  // Start as "loading" to avoid hydration mismatch.
  // Server always renders spinner; client checks localStorage after hydration.
  const [status, setStatus] = useState<"loading" | "auth" | "unauth">("loading");

  useEffect(() => {
    const user = getStoredUser();
    // Reading localStorage is a one-time init per pathname change — not a subscription.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus(user ? "auth" : "unauth");
  }, [pathname]);

  useEffect(() => {
    if (status === "unauth" && pathname !== "/login") {
      router.replace("/login");
    }
  }, [status, pathname, router]);

  // SSR + initial client render: show spinner (no hydration mismatch)
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111827]">
        <div className="w-10 h-10 border-4 border-white/10 border-t-white/50 rounded-full animate-spin" />
      </div>
    );
  }

  // Login page always passes through
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // Unauthenticated: show loader while redirect fires
  if (status === "unauth") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111827]">
        <Loader2 className="w-8 h-8 animate-spin text-white/30" />
      </div>
    );
  }

  // Authenticated
  return <>{children}</>;
}
