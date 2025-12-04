import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Heading,
  Card,
  CardBody,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

interface User {
  id: number;
  nume: string;
  utilizator: string;
  rol: string;
}

export default function AdminUserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const [newPassword, setNewPassword] = useState("");

  // ------------------------------------
  // 1️⃣ LOAD USER INFO
  // ------------------------------------
  const loadUser = async () => {
    try {
      const response = await api.get(`/api/admin/users/${id}`);
      setUser(response.data);
    } catch (err) {
      toast({
        title: "Eroare la încărcarea utilizatorului",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  if (loading || !user) {
    return (
      <Box textAlign="center" mt={20}>
        <Spinner size="xl" />
      </Box>
    );
  }

  // ------------------------------------
  // 2️⃣ SAVE USER UPDATE
  // ------------------------------------
  const handleSave = async () => {
    try {
      await api.put(`/api/admin/users/${id}`, {
        nume: user.nume,
        utilizator: user.utilizator,
        rol: user.rol,
      });

      toast({
        title: "Utilizator actualizat!",
        status: "success",
      });

      navigate("/admin/users");
    } catch (err) {
      toast({
        title: "Eroare la actualizare",
        status: "error",
      });
    }
  };

  // ------------------------------------
  // 3️⃣ RESET PASSWORD
  // ------------------------------------
  const handlePasswordReset = async () => {
    if (!newPassword.trim()) {
      toast({
        title: "Introdu o parolă!",
        status: "warning",
      });
      return;
    }

    try {
      await api.put(`/api/admin/users/${id}/password`, {
        newPassword: newPassword,
      });

      toast({
        title: "Parolă resetată!",
        status: "success",
      });

      setNewPassword("");
    } catch (err) {
      toast({
        title: "Eroare la resetare parolă",
        status: "error",
      });
    }
  };

  return (
    <Box p={8}>
      <Heading mb={6}>Editează utilizator #{id}</Heading>

      {/* ----------------------------- */}
      {/* 🟦 CARD: Editare Date User */}
      {/* ----------------------------- */}
      <Card mb={8}>
        <CardBody>
          <Heading size="md" mb={4}>
            Date utilizator
          </Heading>

          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Nume complet</FormLabel>
              <Input
                value={user.nume}
                onChange={(e) => setUser({ ...user, nume: e.target.value })}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                value={user.utilizator}
                onChange={(e) =>
                  setUser({ ...user, utilizator: e.target.value })
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel>Rol</FormLabel>
              <Select
                value={user.rol}
                onChange={(e) => setUser({ ...user, rol: e.target.value })}
              >
                <option value="ROLE_USER">ROLE_USER</option>
                <option value="ROLE_EDITOR">ROLE_EDITOR</option>
                <option value="ROLE_ADMIN">ROLE_ADMIN</option>
              </Select>
            </FormControl>

            <Button colorScheme="blue" onClick={handleSave}>
              Salvează modificările
            </Button>
          </Stack>
        </CardBody>
      </Card>

      {/* ----------------------------- */}
      {/* 🟥 CARD: Resetare Parolă */}
      {/* ----------------------------- */}
      <Card>
        <CardBody>
          <Heading size="md" mb={4}>
            Resetare parolă
          </Heading>

          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Parolă nouă</FormLabel>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </FormControl>

            <Button colorScheme="red" onClick={handlePasswordReset}>
              Resetează Parola
            </Button>
          </Stack>
        </CardBody>
      </Card>
    </Box>
  );
}
