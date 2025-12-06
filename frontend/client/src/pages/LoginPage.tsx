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
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFormValues>({ mode: "onChange" });

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
    const loggedUser = await login(
      values.username.trim(),
      values.password.trim()
    );

    if (!loggedUser) {
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
          {/* USERNAME */}
          <FormControl isInvalid={!!errors.username}>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Minimum 3 characters",
                },
                validate: (v) =>
                  v.trim().length > 0 || "Username cannot contain only spaces",
              })}
            />
            <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
          </FormControl>

          {/* PASSWORD */}
          <FormControl isInvalid={!!errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 4,
                  message: "Minimum 4 characters",
                },
                validate: (v) =>
                  v.trim().length > 0 || "Password cannot contain only spaces",
              })}
            />
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>

          {/* SUBMIT */}
          <Button
            type="submit"
            isLoading={isSubmitting}
            isDisabled={!isValid}
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
