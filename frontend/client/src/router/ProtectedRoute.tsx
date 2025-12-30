import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { Center, Spinner } from "@chakra-ui/react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    if (user.rol === "ROLE_ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user.rol === "ROLE_EDITOR") {
      return <Navigate to="/editor/projects" replace />;
    }

    return <Navigate to="/tasks" replace />; // ROLE_USER
  }

  return <>{children}</>;
}
