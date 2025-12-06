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
  Card,
  CardBody,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  utilizator: string;
  nume: string;
  rol: string;
}

type TaskFormValues = {
  titlu: string;
  descriere: string;
  status: string;
  prioritate: string;
  categorie: string;
  dataLimita: string;
  idCreator: string; // select returns string
};

export default function EditorTaskCreatePage() {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const toast = useToast();

  // ====================================================
  //  VALIDARE FORM
  // ====================================================
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<TaskFormValues>({ mode: "onChange" });

  // ====================================================
  //  LOAD USERS
  // ====================================================
  const loadUsers = async () => {
    try {
      const response = await api.get("/api/users/all");
      setUsers(response.data.filter((u: User) => u.rol === "ROLE_USER"));
    } catch {
      toast({
        title: "Unable to load users",
        status: "error",
      });
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ====================================================
  //  SUBMIT
  // ====================================================
  const onSubmit = async (values: TaskFormValues) => {
    try {
      await api.post("/api/editor/tasks", {
        titlu: values.titlu,
        descriere: values.descriere,
        status: values.status,
        prioritate: values.prioritate,
        categorie: values.categorie || null,
        dataLimita: values.dataLimita || null,
        idCreator: Number(values.idCreator),
      });

      toast({ title: "Task created successfully", status: "success" });
      navigate("/editor/tasks");
    } catch {
      toast({ title: "Task creation failed", status: "error" });
    }
  };

  // ====================================================
  //  UI
  // ====================================================
  return (
    <Box p={8}>
      <Heading mb={6}>Create new task</Heading>

      <Card>
        <CardBody>
          <Box as="form" onSubmit={handleSubmit(onSubmit)}>
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
                  placeholder="Select status"
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
                  placeholder="Select priority"
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

              {/* SELECT USER */}
              <FormControl isInvalid={!!errors.idCreator}>
                <FormLabel>Assign to user</FormLabel>
                <Select
                  placeholder="Select user"
                  {...register("idCreator", {
                    required: "You must assign a user",
                  })}
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nume} ({u.utilizator})
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.idCreator?.message}</FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isSubmitting}
                isDisabled={!isValid}
              >
                Create Task
              </Button>
            </Stack>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
}
