import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  FormErrorMessage,
  Stack,
  useToast,
  Heading,
  Spinner,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

interface User {
  id: number;
  nume: string;
  utilizator: string;
  rol: string;
}

type TaskFormValues = {
  titlu: string;
  descriere: string;
  status: string;
  prioritate: string;
  categorie: string;
  dataLimita: string;
};

type AssignFormValues = {
  idCreator: string;
};

export default function EditorTaskEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  // ======================================================
  //  MAIN FORM (update task)
  // ======================================================
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<TaskFormValues>({ mode: "onChange" });

  // ======================================================
  //  ASSIGN FORM (separate form)
  // ======================================================
  const {
    register: registerAssign,
    handleSubmit: handleAssignSubmit,
    reset: resetAssign,
    formState: {
      errors: assignErrors,
      isSubmitting: assignSubmitting,
      isValid: assignValid,
    },
  } = useForm<AssignFormValues>({ mode: "onChange" });

  // ======================================================
  //  LOAD TASK
  // ======================================================
  const loadTask = async () => {
    try {
      const response = await api.get(`/api/editor/tasks/${id}`);
      const task = response.data;

      reset({
        titlu: task.titlu,
        descriere: task.descriere,
        status: task.status,
        prioritate: task.prioritate,
        categorie: task.categorie || "",
        dataLimita: task.dataLimita || "",
      });

      // assign form
      resetAssign({
        idCreator: task.idCreator ? String(task.idCreator) : "",
      });
    } catch {
      toast({
        title: "Error loading task",
        status: "error",
      });
    }
  };

  // ======================================================
  //  LOAD USERS
  // ======================================================
  const loadUsers = async () => {
    try {
      const response = await api.get("/api/users/all");
      setUsers(response.data.filter((u: User) => u.rol === "ROLE_USER"));
    } catch {
      toast({
        title: "Error loading users",
        status: "error",
      });
    }
  };

  useEffect(() => {
    Promise.all([loadTask(), loadUsers()]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={20}>
        <Spinner size="xl" />
      </Box>
    );
  }

  // ======================================================
  //  UPDATE TASK
  // ======================================================
  const onSubmitTask = async (values: TaskFormValues) => {
    try {
      await api.put(`/api/editor/tasks/${id}`, {
        ...values,
        dataLimita: values.dataLimita || null,
      });

      toast({
        title: "Task updated successfully",
        status: "success",
      });

      navigate("/editor/tasks");
    } catch {
      toast({
        title: "Update failed",
        status: "error",
      });
    }
  };

  // ======================================================
  //  ASSIGN TASK
  // ======================================================
  const onSubmitAssign = async (values: AssignFormValues) => {
    try {
      await api.post(
        `/api/editor/tasks/${id}/assign?userId=${values.idCreator}`
      );

      toast({
        title: "Task reassigned",
        status: "success",
      });
    } catch {
      toast({
        title: "Assign failed",
        status: "error",
      });
    }
  };

  // ======================================================
  //  UI
  // ======================================================
  return (
    <Box p={8}>
      <Heading mb={6}>Edit Task #{id}</Heading>

      {/* =================================================
          UPDATE CARD
      ================================================== */}
      <Card mb={10}>
        <CardBody>
          <Box as="form" onSubmit={handleSubmit(onSubmitTask)}>
            <Stack spacing={4}>
              {/* TITLU */}
              <FormControl isInvalid={!!errors.titlu}>
                <FormLabel>Title</FormLabel>
                <Input
                  {...register("titlu", {
                    required: "Title is required",
                    minLength: {
                      value: 3,
                      message: "Minimum 3 characters",
                    },
                  })}
                />
                <FormErrorMessage>{errors.titlu?.message}</FormErrorMessage>
              </FormControl>

              {/* DESCRIERE */}
              <FormControl isInvalid={!!errors.descriere}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  {...register("descriere", {
                    minLength: {
                      value: 5,
                      message: "Minimum 5 characters",
                    },
                  })}
                />
                <FormErrorMessage>{errors.descriere?.message}</FormErrorMessage>
              </FormControl>

              {/* STATUS */}
              <FormControl isInvalid={!!errors.status}>
                <FormLabel>Status</FormLabel>
                <Select
                  {...register("status", {
                    required: "Status is required",
                  })}
                >
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="DONE">DONE</option>
                </Select>
                <FormErrorMessage>{errors.status?.message}</FormErrorMessage>
              </FormControl>

              {/* PRIORITATE */}
              <FormControl isInvalid={!!errors.prioritate}>
                <FormLabel>Priority</FormLabel>
                <Select
                  {...register("prioritate", {
                    required: "Priority is required",
                  })}
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </Select>
                <FormErrorMessage>
                  {errors.prioritate?.message}
                </FormErrorMessage>
              </FormControl>

              {/* CATEGORIE */}
              <FormControl isInvalid={!!errors.categorie}>
                <FormLabel>Category</FormLabel>
                <Input
                  {...register("categorie", {
                    maxLength: {
                      value: 30,
                      message: "Maximum 30 characters",
                    },
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
                      if (value < today)
                        return "Deadline cannot be in the past";
                      return true;
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.dataLimita?.message}
                </FormErrorMessage>
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

      {/* =================================================
          ASSIGN CARD
      ================================================== */}
      <Card>
        <CardBody>
          <Heading size="md" mb={4}>
            Reassign Task
          </Heading>

          <Box as="form" onSubmit={handleAssignSubmit(onSubmitAssign)}>
            <Stack spacing={4}>
              <FormControl isInvalid={!!assignErrors.idCreator}>
                <FormLabel>Select user</FormLabel>
                <Select
                  {...registerAssign("idCreator", {
                    required: "You must select a user",
                  })}
                >
                  <option value="">Select...</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nume} ({u.utilizator})
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>
                  {assignErrors.idCreator?.message}
                </FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="purple"
                isLoading={assignSubmitting}
                isDisabled={!assignValid}
              >
                Reassign Task
              </Button>
            </Stack>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
}
