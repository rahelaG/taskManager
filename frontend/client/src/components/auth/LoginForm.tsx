import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Stack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import type { LoginFormValues } from "../../types/auth";

interface Props {
  onSubmit: (values: LoginFormValues) => Promise<void>;
}

export default function LoginForm({ onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFormValues>({ mode: "onChange" });

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        {/* USERNAME */}
        <FormControl isInvalid={!!errors.username}>
          <FormLabel>Username</FormLabel>
          <Input
            {...register("username", {
              required: "Username is required",
              minLength: { value: 3, message: "Minimum 3 characters" },
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
              minLength: { value: 4, message: "Minimum 4 characters" },
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
          Login
        </Button>
      </Stack>
    </Box>
  );
}
