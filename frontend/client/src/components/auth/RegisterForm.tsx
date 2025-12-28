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
import type { RegisterFormValues } from "../../hooks/useRegister";

interface Props {
  onSubmit: (values: RegisterFormValues) => Promise<void>;
}

export default function RegisterForm({ onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RegisterFormValues>({ mode: "onChange" });

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        {/* FULL NAME */}
        <FormControl isInvalid={!!errors.nume}>
          <FormLabel>Full name</FormLabel>
          <Input
            {...register("nume", {
              required: "Full name is required",
              minLength: { value: 2, message: "Minimum 2 characters" },
              maxLength: { value: 50, message: "Maximum 50 characters" },
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
            {...register("username", {
              required: "Username is required",
              minLength: { value: 3, message: "Minimum 3 characters" },
              maxLength: { value: 30, message: "Maximum 30 characters" },
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
              minLength: { value: 6, message: "Minimum 6 characters" },
              validate: (v) =>
                v.trim().length > 0 || "Password cannot contain only spaces",
            })}
          />
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={isSubmitting}
          isDisabled={!isValid}
          w="100%"
        >
          Register
        </Button>
      </Stack>
    </Box>
  );
}
