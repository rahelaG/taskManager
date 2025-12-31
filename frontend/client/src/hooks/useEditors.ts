import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { User } from "../types/user";

export function useEditors() {
  const [editors, setEditors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<User[]>("/api/users/editors")
      .then((res) => setEditors(res.data))
      .catch((err) => {
        console.error("Failed to fetch editors", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { editors, loading };
}
