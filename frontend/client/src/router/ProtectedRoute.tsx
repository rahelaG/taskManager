import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { Center, Spinner } from "@chakra-ui/react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

/**
 * ProtectedRoute verifică:
 *  → dacă userul este logat
 *  → dacă userul are rolul permis
 *  → altfel face redirect corect
 */
export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  //  Dacă încă verificăm login → afișăm spinner
  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  //  Dacă nu există user → redirect la login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  //  Dacă există restricții și rolul nu e permis
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    // redirectăm userul la pagina rolului REAL
    //if (user.rol === "ROLE_ADMIN")
    //return <Navigate to="/admin/dashboard" replace />;
    if (user.rol === "ROLE_EDITOR")
      return <Navigate to="/editor/tasks" replace />;
    return <Navigate to="/tasks" replace />; // ROLE_USER
  }

  //  Dacă totul e OK → afișăm pagina cerută
  return <>{children}</>;
}
