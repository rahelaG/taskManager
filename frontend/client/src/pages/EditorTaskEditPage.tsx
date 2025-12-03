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

export default function EditorTaskEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);

  const [titlu, setTitlu] = useState("");
  const [descriere, setDescriere] = useState("");
  const [status, setStatus] = useState("");
  const [prioritate, setPrioritate] = useState("");
  const [categorie, setCategorie] = useState("");
  const [dataLimita, setDataLimita] = useState("");

  // -------------------------------
  // 1️⃣ FETCH TASK BY ID
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
    } catch (err) {
      toast({
        title: "Eroare la încărcarea task-ului",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTask();
  }, []);

  // -------------------------------
  // 2️⃣ UPDATE TASK
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
      });

      toast({
        title: "Task actualizat!",
        status: "success",
        duration: 3000,
      });

      navigate("/editor/tasks");
    } catch (err) {
      toast({
        title: "Eroare la actualizare",
        status: "error",
        duration: 3000,
      });
    }
  };

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

      <Card>
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
    </Box>
  );
}
