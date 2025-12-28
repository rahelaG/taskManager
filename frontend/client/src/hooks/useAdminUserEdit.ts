import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useToast } from "@chakra-ui/react";
import type { User } from "../types/user";

export function useAdminUserEdit(userId: string | undefined) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const loadUser = async () => {
    try {
      const res = await api.get(`/api/admin/users/${userId}`);
      setUser(res.data);
    } catch {
      toast({ title: "Error loading user", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (values: Partial<User>) => {
    try {
      await api.put(`/api/admin/users/${userId}`, values);
      toast({ title: "User updated successfully", status: "success" });
    } catch {
      toast({ title: "Update failed", status: "error" });
      throw new Error("Update failed");
    }
  };

  const resetPassword = async (newPassword: string) => {
    try {
      await api.put(`/api/admin/users/${userId}/password`, {
        newPassword,
      });
      toast({ title: "Password updated", status: "success" });
    } catch {
      toast({ title: "Password reset failed", status: "error" });
      throw new Error("Password reset failed");
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return {
    user,
    loading,
    updateUser,
    resetPassword,
  };
}
