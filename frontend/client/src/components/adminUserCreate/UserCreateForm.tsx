import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Stack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import type { CreateUserForm } from "../../hooks/useAdminUserCreate";

export default function UserCreateForm({
  onSubmit,
}: {
  onSubmit: (values: CreateUserForm) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateUserForm>({ mode: "onChange" });

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FormControl isInvalid={!!errors.nume}>
          <FormLabel>Full name</FormLabel>
          <Input
            {...register("nume", {
              required: "Full name is required",
              minLength: { value: 2, message: "Minimum 2 characters" },
            })}
          />
          <FormErrorMessage>{errors.nume?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.utilizator}>
          <FormLabel>Username</FormLabel>
          <Input
            {...register("utilizator", {
              required: "Username is required",
              minLength: { value: 3, message: "Minimum 3 characters" },
            })}
          />
          <FormErrorMessage>{errors.utilizator?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.parola}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            {...register("parola", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
            })}
          />
          <FormErrorMessage>{errors.parola?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.rol}>
          <FormLabel>Role</FormLabel>
          <Select
            placeholder="Select role"
            {...register("rol", { required: "Role is required" })}
          >
            <option value="ROLE_USER">ROLE_USER</option>
            <option value="ROLE_EDITOR">ROLE_EDITOR</option>
            <option value="ROLE_ADMIN">ROLE_ADMIN</option>
          </Select>
          <FormErrorMessage>{errors.rol?.message}</FormErrorMessage>
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={isSubmitting}
          isDisabled={!isValid}
        >
          Create user
        </Button>
      </Stack>
    </Box>
  );
}
