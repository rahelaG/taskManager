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
  Spinner,
  Card,
  CardBody,
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

export default function EditorTaskEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  // TASK fields
  const [titlu, setTitlu] = useState("");
  const [descriere, setDescriere] = useState("");
  const [status, setStatus] = useState("");
  const [prioritate, setPrioritate] = useState("");
  const [categorie, setCategorie] = useState("");
  const [dataLimita, setDataLimita] = useState("");
  const [idCreator, setIdCreator] = useState<number | null>(null);

  // -------------------------------
  // 1️⃣ LOAD TASK
  // -------------------------------
  const loadTask = async () => {
    try {
      const response = await api.get(`/api/editor/tasks/${id}`);
      const task = response.data;

      setTitlu(task.titlu);
      setDescriere(task.descriere);
      setStatus(task.status);
      setPrioritate(task.prioritate);
      setCategorie(task.categorie || "");
      setDataLimita(task.dataLimita || "");
      setIdCreator(task.idCreator || null);
    } catch (err) {
      toast({
        title: "Eroare la încărcarea task-ului",
        status: "error",
        duration: 3000,
      });
    }
  };

  // -------------------------------
  // 2️⃣ LOAD USERS (pentru assign)
  // -------------------------------
  const loadUsers = async () => {
    try {
      const response = await api.get("/api/users/all");
      setUsers(response.data.filter((u: User) => u.rol === "ROLE_USER"));
    } catch {
      toast({
        title: "Eroare la încărcarea utilizatorilor",
        status: "error",
      });
    }
  };

  useEffect(() => {
    Promise.all([loadTask(), loadUsers()]).finally(() => setLoading(false));
  }, []);

  // -------------------------------
  // 3️⃣ UPDATE TASK
  // -------------------------------
  const handleUpdate = async () => {
    try {
      await api.put(`/api/editor/tasks/${id}`, {
        titlu,
        descriere,
        status,
        prioritate,
        categorie,
        dataLimita: dataLimita || null,
        idCreator,
      });

      toast({
        title: "Task actualizat!",
        status: "success",
      });

      navigate("/editor/tasks");
    } catch {
      toast({
        title: "Eroare la actualizare",
        status: "error",
      });
    }
  };

  // -------------------------------
  // 4️⃣ ASSIGN USER
  // -------------------------------
  const handleAssign = async () => {
    if (!idCreator) {
      toast({
        title: "Selectează un utilizator",
        status: "warning",
      });
      return;
    }

    try {
      await api.post(`/api/editor/tasks/${id}/assign?userId=${idCreator}`);

      toast({
        title: "Task reasignat!",
        status: "success",
      });
    } catch {
      toast({
        title: "Eroare la reasignare",
        status: "error",
      });
    }
  };

  // -------------------------------
  // UI LOADING
  // -------------------------------
  if (loading) {
    return (
      <Box textAlign="center" mt={20}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={8}>
      <Heading mb={6}>Editează Task #{id}</Heading>

      <Card mb={10}>
        <CardBody>
          <Stack spacing={4}>
            <FormControl>
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

            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="DONE">DONE</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Prioritate</FormLabel>
              <Select
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

            <Button colorScheme="blue" onClick={handleUpdate}>
              Salvează modificările
            </Button>
          </Stack>
        </CardBody>
      </Card>

      {/* ---------------------------------------
          🟣 SECTION: ASSIGN USER
      ---------------------------------------- */}
      <Card>
        <CardBody>
          <Heading size="md" mb={4}>
            Reasignează Task-ul
          </Heading>

          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Alege utilizator</FormLabel>
              <Select
                value={idCreator ?? ""}
                onChange={(e) => setIdCreator(Number(e.target.value))}
              >
                <option value="">Selectează...</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nume} ({u.utilizator})
                  </option>
                ))}
              </Select>
            </FormControl>

            <Button colorScheme="purple" onClick={handleAssign}>
              Reasignează Task
            </Button>
          </Stack>
        </CardBody>
      </Card>
    </Box>
  );
}
