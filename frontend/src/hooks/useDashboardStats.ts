import { useState, useEffect } from "react";
import scheduleService from "../services/scheduleService";
import visitRequestService from "../services/visitRequestService";
import newsService from "../services/newsService";
import { VisitRequest, NewsItem } from "@/types/index";

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
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const [schedulesData, requestsData, newsRaw] = await Promise.all([
        scheduleService.getToday(),
        visitRequestService.getAll(),
        newsService.getAll(),
      ]);

      const schedules = (schedulesData as { data?: unknown[] })?.data ?? (Array.isArray(schedulesData) ? schedulesData : []);
      
      const requests = (requestsData as { data?: unknown[] })?.data ?? (Array.isArray(requestsData) ? requestsData : []);
      
      const newsItems = (newsRaw as { data?: unknown[] })?.data ?? (Array.isArray(newsRaw) ? newsRaw : []);

      setStats({
        total: schedules.length,
        completed: 0, // Will be updated in later iteration
        pending: schedules.length,
        unplanned_requests: requests.length,
      });

      setApprovedRequests(
        (requests as VisitRequest[]).filter((r) => r.status === "approved"),
      );
      setNews(newsItems);
    } catch (error) {
      console.error("Dashboard stats fetch failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, approvedRequests, news, isLoading, refetch: fetchStats };
}
