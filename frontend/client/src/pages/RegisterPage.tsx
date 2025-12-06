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
import { api } from "../services/api";

type RegisterFormValues = {
  nume: string;
  username: string;
  password: string;
};

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RegisterFormValues>({ mode: "onChange" });

  const navigate = useNavigate();
  const toast = useToast();

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await api.post("/api/register", values);

      toast({
        title: "Account created!",
        status: "success",
        duration: 2500,
      });

      navigate("/login", { replace: true });
    } catch {
      toast({
        title: "Register failed",
        description: "Try again.",
        status: "error",
        duration: 3000,
      });
    }
  };

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
      <Box as="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          {/* FULL NAME */}
          <FormControl isInvalid={!!errors.nume}>
            <FormLabel>Full name</FormLabel>
            <Input
              type="text"
              {...register("nume", {
                required: "Full name is required",
                minLength: {
                  value: 2,
                  message: "Minimum 2 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Maximum 50 characters",
                },
                validate: (v) =>
                  v.trim().length > 0 || "Name cannot contain only spaces",
              })}
            />
            <FormErrorMessage>{errors.nume?.message}</FormErrorMessage>
          </FormControl>

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
                maxLength: {
                  value: 30,
                  message: "Maximum 30 characters",
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
                  value: 6, // MATCH backend validation
                  message: "Minimum 6 characters",
                },
                validate: (v) =>
                  v.trim().length > 0 || "Password cannot contain only spaces",
              })}
            />
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            isLoading={isSubmitting}
            isDisabled={!isValid}
            colorScheme="blue"
            w="100%"
          >
            Register
          </Button>
        </Stack>
      </Box>
    </AuthLayout>
  );
}
