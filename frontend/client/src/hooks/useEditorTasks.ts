import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useToast } from "@chakra-ui/react";
import type { Task } from "../types/task";

interface User {
  id: number;
  nume: string;
  utilizator: string;
}

export function useEditorTasks(projectId?: number) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchTasks = async () => {
    const res = await api.get("/api/editor/tasks", {
      params: { projectId },
    });
    setTasks(res.data);
  };

  const fetchUsers = async () => {
    const res = await api.get("/api/users/all");
    setUsers(res.data);
  };

  const deleteTask = async (id: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await api.delete(`/api/editor/tasks/${id}`);
      toast({ title: "Task deleted", status: "success" });
      fetchTasks();
    } catch {
      toast({ title: "Error deleting task", status: "error" });
    }
  };

  useEffect(() => {
    if (!projectId) return;

    setLoading(true);
    Promise.all([fetchTasks(), fetchUsers()])
      .catch(() =>
        toast({ title: "Error loading data", status: "error" })
      )
      .finally(() => setLoading(false));
  }, [projectId]);

  // ✅ userMap CORECT
  const userMap = users.reduce<Record<number, string>>((acc, u) => {
    acc[u.id] = `${u.nume} (${u.utilizator})`;
    return acc;
  }, {});

  return {
    tasks,
    loading,
    userMap,
    deleteTask,
  };
}
