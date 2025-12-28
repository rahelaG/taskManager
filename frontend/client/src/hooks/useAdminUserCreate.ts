import { api } from "../services/api";
import { useToast } from "@chakra-ui/react";

export type CreateUserForm = {
  nume: string;
  utilizator: string;
  parola: string;
  rol: string;
};

export function useAdminUserCreate() {
  const toast = useToast();

  const createUser = async (values: CreateUserForm) => {
    try {
      await api.post("/api/admin/users", values);

      toast({
        title: "User created successfully",
        status: "success",
        duration: 3000,
      });
    } catch {
      toast({
        title: "Error creating user",
        description: "Check if the username already exists.",
        status: "error",
        duration: 3000,
      });

      throw new Error("Create user failed");
    }
  };

  return {
    createUser,
  };
}
