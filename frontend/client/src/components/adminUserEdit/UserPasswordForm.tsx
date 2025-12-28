import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Heading,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

type FormValues = {
  newPassword: string;
};

export default function UserPasswordForm({
  onSubmit,
}: {
  onSubmit: (newPassword: string) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({ mode: "onChange" });

  return (
    <>
      <Heading size="md" mb={4}>
        Reset password
      </Heading>

      <Box
        as="form"
        onSubmit={handleSubmit(async (v) => {
          await onSubmit(v.newPassword);
          reset();
        })}
      >
        <Stack spacing={4}>
          <FormControl isInvalid={!!errors.newPassword}>
            <FormLabel>New password</FormLabel>
            <Input
              type="password"
              {...register("newPassword", {
                required: true,
                minLength: 6,
              })}
            />
            <FormErrorMessage />
          </FormControl>

          <Button
            type="submit"
            colorScheme="red"
            isLoading={isSubmitting}
            isDisabled={!isValid}
          >
            Reset password
          </Button>
        </Stack>
      </Box>
    </>
  );
}
