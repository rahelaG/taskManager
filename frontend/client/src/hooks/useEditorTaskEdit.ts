import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  nume: string;
  utilizator: string;
  rol: string;
}

export function useEditorTaskEdit(taskId?: string, projectId?: string) {
  const toast = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [task, setTask] = useState<any>(null);

  const backToProjectTasks = () => {
    if (projectId) {
      navigate(`/editor/projects/${projectId}/tasks`);
    } else {
      navigate("/editor/projects");
    }
  };

  const loadTask = async () => {
    if (!taskId) return;

    try {
      const res = await api.get(`/api/editor/tasks/${taskId}`);
      setTask(res.data);
    } catch (err: any) {
      const status = err?.response?.status;

      if (status === 403) {
        toast({ title: "No access to this task", status: "error" });
      } else if (status === 404) {
        toast({ title: "Task not found", status: "error" });
      } else {
        toast({ title: "Error loading task", status: "error" });
      }

      backToProjectTasks();
    }
  };

  const loadUsers = async () => {
    const res = await api.get("/api/users/all");
    setUsers(res.data.filter((u: User) => u.rol === "ROLE_USER"));
  };

  const updateTask = async (values: any) => {
    await api.put(`/api/editor/tasks/${taskId}`, values);
    toast({ title: "Task updated", status: "success" });
  };

  const assignTask = async (userId: string) => {
    await api.post(`/api/editor/tasks/${taskId}/assign`, null, {
      params: { userId: Number(userId) },
    });
    toast({ title: "Task reassigned", status: "success" });
    await loadTask();
  };

  useEffect(() => {
    Promise.all([loadTask(), loadUsers()]).finally(() =>
      setLoading(false)
    );
  }, [taskId]);

  return {
    loading,
    users,
    task,
    updateTask,
    assignTask,
  };
}
