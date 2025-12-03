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
import { useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function EditorTaskCreatePage() {
  const [titlu, setTitlu] = useState("");
  const [descriere, setDescriere] = useState("");
  const [status, setStatus] = useState("");
  const [prioritate, setPrioritate] = useState("");
  const [categorie, setCategorie] = useState("");
  const [dataLimita, setDataLimita] = useState("");

  const navigate = useNavigate();
  const toast = useToast();

  const handleCreate = async () => {
    if (!titlu || !status || !prioritate) {
      toast({
        title: "Completează câmpurile obligatorii",
        description: "Titlu, status și prioritate sunt obligatorii.",
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
        dataLimita: dataLimita || null, // 🔥 trimitem null dacă e gol
      });

      toast({
        title: "Task creat cu succes!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/editor/tasks");
    } catch (err) {
      toast({
        title: "Eroare la creare",
        description: "Verifică datele introduse.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={8}>
      <Heading mb={6}>Creează un task nou</Heading>

      <Card>
        <CardBody>
          <Stack spacing={4}>
            {/* TITLU */}
            <FormControl isRequired>
              <FormLabel>Titlu</FormLabel>
              <Input value={titlu} onChange={(e) => setTitlu(e.target.value)} />
            </FormControl>

            {/* DESCRIERE */}
            <FormControl>
              <FormLabel>Descriere</FormLabel>
              <Textarea
                value={descriere}
                onChange={(e) => setDescriere(e.target.value)}
              />
            </FormControl>

            {/* STATUS */}
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

            {/* PRIORITATE */}
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

            {/* CATEGORIE */}
            <FormControl>
              <FormLabel>Categorie</FormLabel>
              <Input
                value={categorie}
                onChange={(e) => setCategorie(e.target.value)}
              />
            </FormControl>

            {/* DEADLINE */}
            <FormControl>
              <FormLabel>Deadline</FormLabel>
              <Input
                type="date"
                value={dataLimita}
                onChange={(e) => setDataLimita(e.target.value)}
              />
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
