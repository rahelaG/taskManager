import {
  Button,
  Card,
  CardBody,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Select,
  Stack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

export default function TaskAssignForm({
  users,
  currentUserId,
  onSubmit,
}: {
  users: any[];
  currentUserId?: number;
  onSubmit: (userId: string) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<{ idCreator: string }>({
    mode: "onChange",
    defaultValues: {
      idCreator: currentUserId ? String(currentUserId) : "",
    },
  });

  return (
    <Card>
      <CardBody>
        <Heading size="md" mb={4}>
          Reassign Task
        </Heading>

        <form onSubmit={handleSubmit((v) => onSubmit(v.idCreator))}>
          <Stack spacing={4}>
            <FormControl isInvalid={!!errors.idCreator}>
              <FormLabel>Select user</FormLabel>
              <Select {...register("idCreator", { required: true })}>
                <option value="">Select...</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nume} ({u.utilizator})
                  </option>
                ))}
              </Select>
              <FormErrorMessage>User is required</FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="purple"
              isLoading={isSubmitting}
              isDisabled={!isValid}
            >
              Reassign Task
            </Button>
          </Stack>
        </form>
      </CardBody>
    </Card>
  );
}
