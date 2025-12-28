import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useToast } from "@chakra-ui/react";
import type { User } from "../types/user";

export function useAdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/admin/users");
      setUsers(res.data);
    } catch {
      toast({ title: "Error loading users", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/api/admin/users/${id}`);
      toast({ title: "User deleted", status: "success" });
      fetchUsers();
    } catch {
      toast({ title: "Delete failed", status: "error" });
    }
  };

  const resetPassword = async (userId: number, newPassword: string) => {
    try {
      await api.put(`/api/admin/users/${userId}/password`, {
        newPassword,
      });
      toast({ title: "Password updated", status: "success" });
    } catch {
      toast({ title: "Reset failed", status: "error" });
      throw new Error("Reset failed");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    deleteUser,
    resetPassword,
  };
}
