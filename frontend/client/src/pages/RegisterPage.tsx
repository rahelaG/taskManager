import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RegisterContainer from "../components/auth/RegisterContainer";

export default function RegisterPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // sau spinner
  }

  // 🔴 AICI ERA PROBLEMA
  if (user) {
    return <Navigate to="/tasks" replace />;
  }

  return <RegisterContainer />;
}
