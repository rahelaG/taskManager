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

export function useEditorTaskEdit(taskId: string | undefined) {
  const toast = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [task, setTask] = useState<any>(null);

  const loadTask = async () => {
    try {
      const res = await api.get(`/api/editor/tasks/${taskId}`);
      setTask(res.data);
    } catch (err: any) {
      if (err.response?.status === 403) {
        toast({
          title: "You don't have access to this task",
          status: "error",
        });
        navigate("/editor/tasks");
      } else if (err.response?.status === 404) {
        toast({
          title: "Task not found",
          status: "error",
        });
        navigate("/editor/tasks");
      } else {
        toast({
          title: "Error loading task",
          status: "error",
        });
      }
      throw err;
    }
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
