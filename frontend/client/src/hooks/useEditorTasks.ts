import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useToast } from "@chakra-ui/react";
import type { Task } from "../types/task";
import { useProjectContext } from "../context/ProjectContext";

interface User {
  id: number;
  nume: string;
  utilizator: string;
}

export function useEditorTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const { currentProject } = useProjectContext();

  const userMap = Object.fromEntries(
    users.map((u) => [u.id, `${u.nume} (${u.utilizator})`])
  );

  const fetchTasks = async () => {
    const url = currentProject
      ? `/api/editor/tasks?projectId=${currentProject.id}`
      : `/api/editor/tasks`;

    const res = await api.get(url);
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
    setLoading(true);

    Promise.all([fetchTasks(), fetchUsers()])
      .catch(() =>
        toast({ title: "Error loading data", status: "error" })
      )
      .finally(() => setLoading(false));
    // 🔥 refacem fetch dacă se schimbă proiectul selectat
  }, [currentProject?.id]);

  return {
    tasks,
    loading,
    userMap,
    deleteTask,
  };
}
