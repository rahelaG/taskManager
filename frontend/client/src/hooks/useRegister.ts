import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export interface RegisterFormValues {
  nume: string;
  username: string;
  password: string;
}

export function useRegister() {
  const toast = useToast();
  const navigate = useNavigate();

  const registerUser = async (values: RegisterFormValues) => {
    try {
      await api.post("/api/register", values);
 // ✅ endpoint corect

      toast({
        title: "Account created",
        description: "You can now log in",
        status: "success",
        duration: 2500,
        isClosable: true,
      });

      navigate("/login", { replace: true });
    } catch (err: any) {
      toast({
        title: "Register failed",
        description:
          err?.response?.data?.error || "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return { registerUser };
}
