import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Stack,
  Heading,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import type { User } from "../../types/user";

type FormValues = {
  nume: string;
  utilizator: string;
  rol: string;
};

export default function UserDetailsForm({
  user,
  onSubmit,
}: {
  user: User;
  onSubmit: (values: FormValues) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      nume: user.nume,
      utilizator: user.utilizator,
      rol: user.rol,
    },
  });

  return (
    <>
      <Heading size="md" mb={4}>
        User details
      </Heading>

      <Box as="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <FormControl isInvalid={!!errors.nume}>
            <FormLabel>Full name</FormLabel>
            <Input {...register("nume", { required: true, minLength: 2 })} />
            <FormErrorMessage />
          </FormControl>

          <FormControl isInvalid={!!errors.utilizator}>
            <FormLabel>Username</FormLabel>
            <Input
              {...register("utilizator", {
                required: true,
                minLength: 3,
              })}
            />
            <FormErrorMessage />
          </FormControl>

          <FormControl isInvalid={!!errors.rol}>
            <FormLabel>Role</FormLabel>
            <Select {...register("rol", { required: true })}>
              <option value="ROLE_USER">ROLE_USER</option>
              <option value="ROLE_EDITOR">ROLE_EDITOR</option>
              <option value="ROLE_ADMIN">ROLE_ADMIN</option>
            </Select>
            <FormErrorMessage />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isSubmitting}
            isDisabled={!isValid}
          >
            Save changes
          </Button>
        </Stack>
      </Box>
    </>
  );
}
