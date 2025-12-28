import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useToast } from "@chakra-ui/react";
import type { TaskFormValues } from "../components/tasks/TaskForm";

interface User {
  id: number;
  nume: string;
  utilizator: string;
  rol: string;
}

export function useEditorTaskCreate() {
  const [users, setUsers] = useState<User[]>([]);
  const toast = useToast();

  const loadUsers = async () => {
    try {
      const res = await api.get("/api/users/all");
      setUsers(res.data.filter((u: User) => u.rol === "ROLE_USER"));
    } catch {
      toast({ title: "Unable to load users", status: "error" });
    }
  };

  const createTask = async (values: TaskFormValues) => {
    try {
      await api.post("/api/editor/tasks", {
        ...values,
        categorie: values.categorie || null,
        dataLimita: values.dataLimita || null,
        idCreator: Number(values.idCreator),
      });

      toast({ title: "Task created successfully", status: "success" });
    } catch {
      toast({ title: "Task creation failed", status: "error" });
      throw new Error("Create task failed");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    createTask,
  };
}
