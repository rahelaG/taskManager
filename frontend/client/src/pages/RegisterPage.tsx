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
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>();

  const navigate = useNavigate();
  const toast = useToast();

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await api.post("/api/register", values);

      toast({
        title: "Account created!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/login", { replace: true });
    } catch {
      toast({
        title: "Register failed",
        description: "Try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
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
          <FormControl isInvalid={!!errors.nume}>
            <FormLabel>Full name</FormLabel>
            <Input
              type="text"
              {...register("nume", { required: "Name is required" })}
            />
            <FormErrorMessage>{errors.nume?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.username}>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              {...register("username", {
                required: "Username is required",
              })}
            />
            <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
          </FormControl>

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
              })}
            />
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            isLoading={isSubmitting}
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
