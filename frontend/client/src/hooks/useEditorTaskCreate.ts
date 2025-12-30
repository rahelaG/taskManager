import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useToast } from "@chakra-ui/react";
import { useProjectContext } from "../context/ProjectContext";

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

export function useEditorTaskCreate() {
  const [users, setUsers] = useState<User[]>([]);
  const toast = useToast();
  const { currentProject } = useProjectContext(); // 🔥 SAFE hook

  useEffect(() => {
    api.get("/api/users/all").then((res) => setUsers(res.data));
  }, []);

  const createTask = async (values: TaskFormValues) => {
    if (!currentProject) {
      throw new Error("No project selected");
    }

    await api.post("/api/editor/tasks", {
      ...values,
      idCreator: values.idCreator
        ? Number(values.idCreator)
        : undefined,
      projectId: currentProject.id,
    });

    toast({
      title: "Task created",
      status: "success",
    });
  };

  return {
    users,
    createTask,
  };
}
