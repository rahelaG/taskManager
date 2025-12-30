import { Box, useToast } from "@chakra-ui/react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import AuthLayout from "../common/AuthLayout";
import LoginForm from "./LoginForm";
import { useAuth } from "../../context/AuthContext";
import type { LoginFormValues } from "../../types/auth";

export default function LoginContainer() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const redirectByRole = (role: string) => {
    switch (role) {
      case "ROLE_ADMIN":
        navigate("/admin/dashboard", { replace: true });
        break;
      case "ROLE_EDITOR":
        navigate("/editor/projects", { replace: true });
        break;
      default:
        navigate("/tasks", { replace: true });
    }
  };

  const handleLogin = async (values: LoginFormValues) => {
    const user = await login(values.username.trim(), values.password.trim());

    if (!user) {
      toast({
        title: "Login failed",
        description: "Check your username or password.",
        status: "error",
        duration: 3000,
      });
      return;
    }

    toast({
      title: "Login successful",
      status: "success",
      duration: 2000,
    });

    redirectByRole(user.rol);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to manage your tasks"
      footer={
        <Box fontSize="sm">
          Don't have an account?{" "}
          <RouterLink to="/register" style={{ color: "#3182CE" }}>
            Create one
          </RouterLink>
        </Box>
      }
    >
      <LoginForm onSubmit={handleLogin} />
    </AuthLayout>
  );
}
