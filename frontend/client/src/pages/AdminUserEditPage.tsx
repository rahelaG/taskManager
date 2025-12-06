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
  Spinner,
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

type EditUserForm = {
  nume: string;
  utilizator: string;
  rol: string;
};

type PasswordForm = {
  newPassword: string;
};

export default function AdminUserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);

  // ================================
  // 1. MAIN USER FORM
  // ================================
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<EditUserForm>({ mode: "onChange" });

  // ================================
  // 2. PASSWORD RESET FORM
  // ================================
  const {
    register: registerPass,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: {
      errors: passErrors,
      isSubmitting: passSubmitting,
      isValid: passValid,
    },
  } = useForm<PasswordForm>({ mode: "onChange" });

  // ================================
  // LOAD USER
  // ================================
  const loadUser = async () => {
    try {
      const response = await api.get(`/api/admin/users/${id}`);
      const data: User = response.data;

      // populate main form
      reset({
        nume: data.nume,
        utilizator: data.utilizator,
        rol: data.rol,
      });
    } catch {
      toast({
        title: "Error loading user",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={20}>
        <Spinner size="xl" />
      </Box>
    );
  }

  // ================================
  // SAVE USER UPDATE
  // ================================
  const onSubmitUser = async (values: EditUserForm) => {
    try {
      await api.put(`/api/admin/users/${id}`, values);

      toast({
        title: "User updated successfully",
        status: "success",
      });

      navigate("/admin/users");
    } catch {
      toast({
        title: "Update failed",
        status: "error",
      });
    }
  };

  // ================================
  // RESET PASSWORD
  // ================================
  const onSubmitPassword = async (values: PasswordForm) => {
    try {
      await api.put(`/api/admin/users/${id}/password`, {
        newPassword: values.newPassword,
      });

      toast({
        title: "Password updated",
        status: "success",
      });

      resetPassword();
    } catch {
      toast({
        title: "Password reset failed",
        status: "error",
      });
    }
  };

  // ================================
  // UI
  // ================================
  return (
    <Box p={8}>
      <Heading mb={6}>Edit user #{id}</Heading>

      {/* ===================================== */}
      {/* CARD: EDIT USER DETAILS               */}
      {/* ===================================== */}
      <Card mb={8}>
        <CardBody>
          <Heading size="md" mb={4}>
            User details
          </Heading>

          <Box as="form" onSubmit={handleSubmit(onSubmitUser)}>
            <Stack spacing={4}>
              {/* FULL NAME */}
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

              {/* USERNAME */}
              <FormControl isInvalid={!!errors.utilizator}>
                <FormLabel>Username</FormLabel>
                <Input
                  {...register("utilizator", {
                    required: "Username is required",
                    minLength: { value: 3, message: "Minimum 3 characters" },
                  })}
                />
                <FormErrorMessage>
                  {errors.utilizator?.message}
                </FormErrorMessage>
              </FormControl>

              {/* ROLE */}
              <FormControl isInvalid={!!errors.rol}>
                <FormLabel>Role</FormLabel>
                <Select {...register("rol", { required: "Role is required" })}>
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
                Save changes
              </Button>
            </Stack>
          </Box>
        </CardBody>
      </Card>

      {/* ===================================== */}
      {/* CARD: RESET PASSWORD                  */}
      {/* ===================================== */}
      <Card>
        <CardBody>
          <Heading size="md" mb={4}>
            Reset password
          </Heading>

          <Box as="form" onSubmit={handlePasswordSubmit(onSubmitPassword)}>
            <Stack spacing={4}>
              {/* NEW PASSWORD */}
              <FormControl isInvalid={!!passErrors.newPassword}>
                <FormLabel>New password</FormLabel>
                <Input
                  type="password"
                  {...registerPass("newPassword", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Minimum 6 characters",
                    },
                  })}
                />
                <FormErrorMessage>
                  {passErrors.newPassword?.message}
                </FormErrorMessage>
              </FormControl>

              {/* SUBMIT */}
              <Button
                type="submit"
                colorScheme="red"
                isLoading={passSubmitting}
                isDisabled={!passValid}
              >
                Reset password
              </Button>
            </Stack>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
}
