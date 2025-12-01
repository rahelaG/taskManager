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
  rol: string; // ROLE_USER / ROLE_EDITOR / ROLE_ADMIN
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // -------------------------
  // 1️⃣ FETCH USERUL LOGAT
  // -------------------------
  const fetchCurrentUser = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data);
    } catch (err) {
      setUser(null); // nu e logat
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // -------------------------
  // 2️⃣ LOGIN
  // -------------------------
  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const params = new URLSearchParams();
      params.append("username", username);
      params.append("password", password);

      await api.post("/login", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      await fetchCurrentUser();
      return true;
    } catch (error) {
      return false;
    }
  };

  // -------------------------
  // 3️⃣ LOGOUT
  // -------------------------
  const logout = async () => {
    await api.post("/auth/logout"); // dacă ai /api în Axios baseURL
    setUser(null);
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
