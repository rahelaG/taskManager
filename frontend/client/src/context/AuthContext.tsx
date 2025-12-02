import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api } from "../services/api";

interface User {
  id: number;
  username: string;
  nume: string;
  rol: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // -------------------------
  // FETCH USER LOGAT
  // -------------------------
  const fetchCurrentUser = async (): Promise<User | null> => {
    try {
      const response = await api.get("/api/auth/me");
      setUser(response.data);
      return response.data;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // -------------------------
  // LOGIN
  // -------------------------
  const login = async (
    username: string,
    password: string
  ): Promise<User | null> => {
    try {
      const params = new URLSearchParams();
      params.append("username", username);
      params.append("password", password);

      // TRIMITE Direct la backend (fără /api)
      await api.post("/do-login", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      return await fetchCurrentUser();
    } catch {
      return null;
    }
  };

  // -------------------------
  // LOGOUT
  // -------------------------
  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
