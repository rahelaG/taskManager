import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  useToast,
  Heading,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminUserCreatePage() {
  const [nume, setNume] = useState("");
  const [utilizator, setUtilizator] = useState("");
  const [parola, setParola] = useState("");
  const [rol, setRol] = useState("");

  const toast = useToast();
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!nume || !utilizator || !parola || !rol) {
      toast({
        title: "Completează toate câmpurile!",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      await api.post("/api/admin/users", {
        nume,
        utilizator,
        parola,
        rol,
      });

      toast({
        title: "User creat cu succes!",
        status: "success",
        duration: 3000,
      });

      navigate("/admin/users");
    } catch (err) {
      toast({
        title: "Eroare la creare user",
        description: "Verifică dacă username-ul este unic.",
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Box p={8}>
      <Heading mb={6}>Creează utilizator nou</Heading>

      <Card>
        <CardBody>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Nume complet</FormLabel>
              <Input value={nume} onChange={(e) => setNume(e.target.value)} />
            </FormControl>

            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                value={utilizator}
                onChange={(e) => setUtilizator(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Parolă</FormLabel>
              <Input
                type="password"
                value={parola}
                onChange={(e) => setParola(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Rol</FormLabel>
              <Select
                placeholder="Alege rolul"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
              >
                <option value="ROLE_USER">ROLE_USER</option>
                <option value="ROLE_EDITOR">ROLE_EDITOR</option>
                <option value="ROLE_ADMIN">ROLE_ADMIN</option>
              </Select>
            </FormControl>

            <Button colorScheme="blue" onClick={handleCreate}>
              Creează Utilizator
            </Button>
          </Stack>
        </CardBody>
      </Card>
    </Box>
  );
}
