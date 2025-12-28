import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

export type TaskFormValues = {
  titlu: string;
  descriere: string;
  status: string;
  prioritate: string;
  categorie: string;
  dataLimita: string;
  idCreator?: string; // optional: only when assigning is needed (create)
};

type UserOption = { id: number; nume: string; utilizator: string };

type Props = {
  defaultValues?: Partial<TaskFormValues>;
  users?: UserOption[]; // if present -> show assign select
  submitLabel: string;
  onSubmit: (values: TaskFormValues) => Promise<void>;
};

export default function TaskForm({
  defaultValues,
  users,
  submitLabel,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<TaskFormValues>({
    mode: "onChange",
    defaultValues: {
      titlu: defaultValues?.titlu ?? "",
      descriere: defaultValues?.descriere ?? "",
      status: defaultValues?.status ?? "TODO",
      prioritate: defaultValues?.prioritate ?? "LOW",
      categorie: defaultValues?.categorie ?? "",
      dataLimita: defaultValues?.dataLimita ?? "",
      idCreator: defaultValues?.idCreator ?? "",
    },
  });

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        {/* TITLE */}
        <FormControl isInvalid={!!errors.titlu}>
          <FormLabel>Title</FormLabel>
          <Input
            {...register("titlu", {
              required: "Title is required",
              minLength: { value: 3, message: "Minimum 3 characters" },
            })}
          />
          <FormErrorMessage>{errors.titlu?.message}</FormErrorMessage>
        </FormControl>

        {/* DESCRIPTION */}
        <FormControl isInvalid={!!errors.descriere}>
          <FormLabel>Description</FormLabel>
          <Textarea
            {...register("descriere", {
              minLength: { value: 5, message: "Minimum 5 characters" },
            })}
          />
          <FormErrorMessage>{errors.descriere?.message}</FormErrorMessage>
        </FormControl>

        {/* STATUS */}
        <FormControl isInvalid={!!errors.status}>
          <FormLabel>Status</FormLabel>
          <Select {...register("status", { required: "Status is required" })}>
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="DONE">DONE</option>
          </Select>
          <FormErrorMessage>{errors.status?.message}</FormErrorMessage>
        </FormControl>

        {/* PRIORITY */}
        <FormControl isInvalid={!!errors.prioritate}>
          <FormLabel>Priority</FormLabel>
          <Select
            {...register("prioritate", { required: "Priority is required" })}
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </Select>
          <FormErrorMessage>{errors.prioritate?.message}</FormErrorMessage>
        </FormControl>

        {/* CATEGORY */}
        <FormControl isInvalid={!!errors.categorie}>
          <FormLabel>Category</FormLabel>
          <Input
            {...register("categorie", {
              maxLength: { value: 30, message: "Maximum 30 characters" },
            })}
          />
          <FormErrorMessage>{errors.categorie?.message}</FormErrorMessage>
        </FormControl>

        {/* DEADLINE */}
        <FormControl isInvalid={!!errors.dataLimita}>
          <FormLabel>Deadline</FormLabel>
          <Input
            type="date"
            {...register("dataLimita", {
              validate: (value) => {
                if (!value) return true;
                const today = new Date().toISOString().split("T")[0];
                if (value < today) return "Deadline cannot be in the past";
                return true;
              },
            })}
          />
          <FormErrorMessage>{errors.dataLimita?.message}</FormErrorMessage>
        </FormControl>

        {/* ASSIGN USER (only for create or when needed) */}
        {users && (
          <FormControl isInvalid={!!errors.idCreator}>
            <FormLabel>Assign to user</FormLabel>
            <Select
              {...register("idCreator", {
                required: "You must assign a user",
              })}
            >
              <option value="">Select user</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nume} ({u.utilizator})
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.idCreator?.message}</FormErrorMessage>
          </FormControl>
        )}

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={isSubmitting}
          isDisabled={!isValid}
        >
          {submitLabel}
        </Button>
      </Stack>
    </Box>
  );
}
