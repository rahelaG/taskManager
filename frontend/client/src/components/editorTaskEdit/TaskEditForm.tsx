import {
  Box,
  Button,
  Card,
  CardBody,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

type FormValues = {
  titlu: string;
  descriere: string;
  status: string;
  prioritate: string;
  categorie: string;
  dataLimita: string;
};

export default function TaskEditForm({
  task,
  onSubmit,
}: {
  task: any;
  onSubmit: (values: FormValues) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      titlu: task.titlu,
      descriere: task.descriere,
      status: task.status,
      prioritate: task.prioritate,
      categorie: task.categorie || "",
      dataLimita: task.dataLimita || "",
    },
  });

  return (
    <Card mb={10}>
      <CardBody>
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <FormControl isInvalid={!!errors.titlu}>
              <FormLabel>Title</FormLabel>
              <Input {...register("titlu", { required: true })} />
              <FormErrorMessage />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea {...register("descriere")} />
            </FormControl>

            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select {...register("status", { required: true })}>
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="DONE">DONE</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Priority</FormLabel>
              <Select {...register("prioritate", { required: true })}>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Category</FormLabel>
              <Input {...register("categorie")} />
            </FormControl>

            <FormControl>
              <FormLabel>Deadline</FormLabel>
              <Input type="date" {...register("dataLimita")} />
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
      </CardBody>
    </Card>
  );
}
