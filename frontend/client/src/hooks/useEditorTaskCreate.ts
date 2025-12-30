import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useToast } from "@chakra-ui/react";

interface User {
  id: number;
  nume: string;
  utilizator: string;
}

type TaskFormValues = {
  titlu: string;
  descriere: string;
  status: string;
  prioritate: string;
  categorie: string;
  idCreator?: string;
};

export function useEditorTaskCreate(projectId?: number) {
  const [users, setUsers] = useState<User[]>([]);
  const toast = useToast();

  useEffect(() => {
    api.get("/api/users/all").then((res) => setUsers(res.data));
  }, []);

  const createTask = async (values: TaskFormValues) => {
    await api.post("/api/editor/tasks", {
      ...values,
      projectId,
      idCreator: values.idCreator
        ? Number(values.idCreator)
        : undefined,
    });

    toast({ title: "Task created", status: "success" });
  };

  return {
    users,
    createTask,
  };
}
