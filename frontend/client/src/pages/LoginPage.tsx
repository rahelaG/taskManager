import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import AuthLayout from "../components/common/AuthLayout";
import { useAuth } from "../context/AuthContext";

type LoginFormValues = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const redirectByRole = (role: string) => {
    switch (role) {
      case "ROLE_ADMIN":
        navigate("/admin/dashboard", { replace: true });
        break;
      case "ROLE_EDITOR":
        navigate("/editor/tasks", { replace: true });
        break;
      default:
        navigate("/tasks", { replace: true });
    }
  };

  const onSubmit = async (values: LoginFormValues) => {
    const loggedUser = await login(values.username, values.password);

    // ❌ LOGIN FAIL
    if (!loggedUser) {
      toast({
        title: "Login failed",
        description: "Check your username or password.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // ✅ LOGIN OK
    toast({
      title: "Login successful",
      status: "success",
      duration: 2000,
      isClosable: true,
    });

    redirectByRole(loggedUser.rol);
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
      <Box as="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <FormControl isInvalid={!!errors.username}>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              {...register("username", { required: "Username is required" })}
            />
            <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              {...register("password", { required: "Password is required" })}
            />
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            isLoading={isSubmitting}
            colorScheme="blue"
            w="100%"
          >
            Login
          </Button>
        </Stack>
      </Box>
    </AuthLayout>
  );
}
