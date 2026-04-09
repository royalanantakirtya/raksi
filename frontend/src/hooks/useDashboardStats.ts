import { useState, useEffect } from "react";
import scheduleService from "../services/scheduleService";
import visitRequestService from "../services/visitRequestService";
import { VisitRequest } from "@/types";

interface DashboardStats {
  total: number;
  completed: number;
  pending: number;
  unplanned_requests: number;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    completed: 0,
    pending: 0,
    unplanned_requests: 0,
  });
  const [approvedRequests, setApprovedRequests] = useState<VisitRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const [schedules, requests] = await Promise.all([
        scheduleService.getToday(),
        visitRequestService.getAll(),
      ]);
      setStats({
        total: schedules.length,
        completed: 0,
        pending: schedules.length,
        unplanned_requests: requests.length,
      });
      setApprovedRequests(
        requests.filter((r: VisitRequest) => r.status === "approved"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, approvedRequests, isLoading, refetch: fetchStats };
}
