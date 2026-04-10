import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as authService from "../services/authService";

interface User {
  id: number;
  kode_user: string;
  nama_user: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      setIsChecking(true);
      try {
        const userData = await authService.getUser();
        setUser(userData.data || userData); // Handle both nested data and direct responses
      } catch (err) {
        console.error("Auth check failed", err);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  return { user, isChecking };
}
