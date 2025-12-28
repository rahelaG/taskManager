import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";
import type { Task, TaskFilters } from "../types/task";

export function useTasks(initialFilters?: Partial<TaskFilters>) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [filters, setFilters] = useState<TaskFilters>({
    status: initialFilters?.status ?? "",
    prioritate: initialFilters?.prioritate ?? "",
    categorie: initialFilters?.categorie ?? "",
  });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/tasks", {
        params: {
          status: filters.status || null,
          prioritate: filters.prioritate || null,
          categorie: filters.categorie || null,
        },
      });

      setTasks(response.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.prioritate, filters.categorie]);

  // load initial
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    filters,
    setFilters,
    fetchTasks, // expus ca să-l chemi la click pe "Aplică filtre"
  };
}
