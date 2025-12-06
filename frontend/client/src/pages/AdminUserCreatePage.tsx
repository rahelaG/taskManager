import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  FormErrorMessage,
  Stack,
  Heading,
  Card,
  CardBody,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

type CreateUserForm = {
  nume: string;
  utilizator: string;
  parola: string;
  rol: string;
};

export default function AdminUserCreatePage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateUserForm>({ mode: "onChange" });

  const toast = useToast();
  const navigate = useNavigate();

  const onSubmit = async (values: CreateUserForm) => {
    try {
      await api.post("/api/admin/users", values);

      toast({
        title: "User created successfully",
        status: "success",
        duration: 3000,
      });

      navigate("/admin/users");
    } catch (err) {
      toast({
        title: "Error creating user",
        description: "Check if the username already exists.",
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Box p={8}>
      <Heading mb={6}>Create new user</Heading>

      <Card>
        <CardBody>
          <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              {/* NUME */}
              <FormControl isInvalid={!!errors.nume}>
                <FormLabel>Full name</FormLabel>
                <Input
                  {...register("nume", {
                    required: "Full name is required",
                    minLength: {
                      value: 2,
                      message: "Minimum 2 characters",
                    },
                  })}
                />
                <FormErrorMessage>{errors.nume?.message}</FormErrorMessage>
              </FormControl>

              {/* USERNAME */}
              <FormControl isInvalid={!!errors.utilizator}>
                <FormLabel>Username</FormLabel>
                <Input
                  {...register("utilizator", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Minimum 3 characters",
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.utilizator?.message}
                </FormErrorMessage>
              </FormControl>

              {/* PAROLA */}
              <FormControl isInvalid={!!errors.parola}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  {...register("parola", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Minimum 6 characters",
                    },
                  })}
                />
                <FormErrorMessage>{errors.parola?.message}</FormErrorMessage>
              </FormControl>

              {/* ROL */}
              <FormControl isInvalid={!!errors.rol}>
                <FormLabel>Role</FormLabel>
                <Select
                  placeholder="Select role"
                  {...register("rol", {
                    required: "Role is required",
                  })}
                >
                  <option value="ROLE_USER">ROLE_USER</option>
                  <option value="ROLE_EDITOR">ROLE_EDITOR</option>
                  <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                </Select>
                <FormErrorMessage>{errors.rol?.message}</FormErrorMessage>
              </FormControl>

              {/* SUBMIT */}
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
        </CardBody>
      </Card>
    </Box>
  );
}
