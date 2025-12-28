import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useToast } from "@chakra-ui/react";

interface User {
  id: number;
  nume: string;
  utilizator: string;
  rol: string;
}

export function useEditorTaskEdit(taskId: string | undefined) {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [task, setTask] = useState<any>(null);

  const loadTask = async () => {
    const res = await api.get(`/api/editor/tasks/${taskId}`);
    setTask(res.data);
  };

  const loadUsers = async () => {
    const res = await api.get("/api/users/all");
    setUsers(res.data.filter((u: User) => u.rol === "ROLE_USER"));
  };

  const updateTask = async (values: any) => {
    await api.put(`/api/editor/tasks/${taskId}`, values);
    toast({ title: "Task updated successfully", status: "success" });
  };

  const assignTask = async (userId: string) => {
    await api.post(
      `/api/editor/tasks/${taskId}/assign?userId=${userId}`
    );
    toast({ title: "Task reassigned", status: "success" });
  };

  useEffect(() => {
    Promise.all([loadTask(), loadUsers()])
      .catch(() =>
        toast({ title: "Error loading data", status: "error" })
      )
      .finally(() => setLoading(false));
  }, []);

  return {
    loading,
    users,
    task,
    updateTask,
    assignTask,
  };
}
