import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Stack,
  useToast,
  Heading,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  utilizator: string;
  nume: string;
}

export default function EditorTaskCreatePage() {
  const [titlu, setTitlu] = useState("");
  const [descriere, setDescriere] = useState("");
  const [status, setStatus] = useState("");
  const [prioritate, setPrioritate] = useState("");
  const [categorie, setCategorie] = useState("");
  const [dataLimita, setDataLimita] = useState("");
  const [idCreator, setIdCreator] = useState<number | null>(null);

  const [users, setUsers] = useState<User[]>([]);

  const navigate = useNavigate();
  const toast = useToast();

  // ---------------------------
  // GET all users (for assign)
  // ---------------------------
  const loadUsers = async () => {
    try {
      const response = await api.get("/api/users/all");
      setUsers(response.data);
    } catch {
      toast({
        title: "Nu pot încărca utilizatorii",
        status: "error",
      });
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async () => {
    if (!titlu || !status || !prioritate || !idCreator) {
      toast({
        title: "Completează câmpurile obligatorii",
        description: "Titlu, status, prioritate și user sunt obligatorii.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await api.post("/api/editor/tasks", {
        titlu,
        descriere,
        status,
        prioritate,
        categorie,
        dataLimita: dataLimita || null,
        idCreator, // 🔥 assign user
      });

      toast({
        title: "Task creat cu succes!",
        status: "success",
      });

      navigate("/editor/tasks");
    } catch (err) {
      toast({
        title: "Eroare la creare",
        status: "error",
      });
    }
  };

  return (
    <Box p={8}>
      <Heading mb={6}>Creează un task nou</Heading>

      <Card>
        <CardBody>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Titlu</FormLabel>
              <Input value={titlu} onChange={(e) => setTitlu(e.target.value)} />
            </FormControl>

            <FormControl>
              <FormLabel>Descriere</FormLabel>
              <Textarea
                value={descriere}
                onChange={(e) => setDescriere(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Status</FormLabel>
              <Select
                placeholder="Alege status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="DONE">DONE</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Prioritate</FormLabel>
              <Select
                placeholder="Alege prioritatea"
                value={prioritate}
                onChange={(e) => setPrioritate(e.target.value)}
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Categorie</FormLabel>
              <Input
                value={categorie}
                onChange={(e) => setCategorie(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Deadline</FormLabel>
              <Input
                type="date"
                value={dataLimita}
                onChange={(e) => setDataLimita(e.target.value)}
              />
            </FormControl>

            {/* 🔥 ASSIGN USER */}
            <FormControl isRequired>
              <FormLabel>Atribuie utilizator</FormLabel>
              <Select
                placeholder="Alege utilizator"
                value={idCreator ?? ""}
                onChange={(e) => setIdCreator(Number(e.target.value))}
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nume} ({u.utilizator})
                  </option>
                ))}
              </Select>
            </FormControl>

            <Button colorScheme="blue" onClick={handleCreate}>
              Creează Task
            </Button>
          </Stack>
        </CardBody>
      </Card>
    </Box>
  );
}
