import { Box } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import AuthLayout from "../common/AuthLayout";
import RegisterForm from "./RegisterForm";
import { useRegister } from "../../hooks/useRegister";

export default function RegisterContainer() {
  const { registerUser } = useRegister();

  return (
    <AuthLayout
      title="Create account"
      subtitle="Register to start managing your tasks"
      footer={
        <Box fontSize="sm">
          Already have an account?{" "}
          <RouterLink to="/login" style={{ color: "#3182CE" }}>
            Sign in
          </RouterLink>
        </Box>
      }
    >
      <RegisterForm onSubmit={registerUser} />
    </AuthLayout>
  );
}
