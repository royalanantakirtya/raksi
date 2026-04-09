import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import authService from "../services/authService";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      setIsChecking(true);
      try {
        const userData = await authService.getUser();
        setUser(userData);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  return { user, isChecking };
}
