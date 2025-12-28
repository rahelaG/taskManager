import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useToast } from "@chakra-ui/react";
import type { DashboardStats } from "../types/dashboard";

export function useAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const loadStats = async () => {
    try {
      const res = await api.get("/api/admin/dashboard");
      setStats(res.data);
    } catch {
      toast({
        title: "Error loading admin dashboard",
        description: "Please try again later.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return {
    stats,
    loading,
  };
}
