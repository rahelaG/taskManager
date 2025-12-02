import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Select,
  Text,
  Input,
  Spinner,
  Card,
  CardBody,
  Badge,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
interface Task {
  id: number;
  titlu: string;
  descriere: string;
  status: string;
  prioritate: string;
  categorie: string;
  dataCreare: string;
  dataLimita: string;
}

export default function TasksPage() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // filtre
  const [status, setStatus] = useState<string>("");
  const [prioritate, setPrioritate] = useState<string>("");
  const [categorie, setCategorie] = useState<string>("");

  // -----------------------------
  // 🔥 Fetch TASKS pentru User
  // -----------------------------
  const fetchTasks = async () => {
    try {
      const response = await api.get("/api/tasks", {
        params: {
          status: status || null,
          prioritate: prioritate || null,
          categorie: categorie || null,
        },
      });

      setTasks(response.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  // load initial
  useEffect(() => {
    fetchTasks();
  }, []);

  // load when filters change
  const handleFilter = () => {
    setLoading(true);
    fetchTasks();
  };

  // UI LOADING
  if (loading) {
    return (
      <Flex align="center" justify="center" height="70vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={8}>
      {/* HEADER */}
      <Heading mb={4}>
        👋 Salut,{" "}
        <Text as="span" color="blue.500">
          {user?.nume}
        </Text>
        !
      </Heading>

      <Text fontSize="lg" mb={6}>
        Aici vezi toate task-urile tale.
      </Text>

      {/* 🔎 FILTRE */}
      <Card mb={6}>
        <CardBody>
          <Heading size="md" mb={4}>
            Filtrează task-urile
          </Heading>

          <Flex gap={4} flexWrap="wrap">
            {/* STATUS */}
            <Select
              placeholder="Toate statusurile"
              w="200px"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DONE">DONE</option>
            </Select>

            {/* PRIORITATE */}
            <Select
              placeholder="Toate prioritățile"
              w="200px"
              value={prioritate}
              onChange={(e) => setPrioritate(e.target.value)}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </Select>

            {/* CATEGORIE */}
            <Input
              placeholder="Categorie..."
              w="200px"
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
            />

            <Button colorScheme="blue" onClick={handleFilter}>
              Aplică filtre
            </Button>
          </Flex>
        </CardBody>
      </Card>

      {/* 📋 LISTA TASK-URI */}
      {tasks.length === 0 ? (
        <Text fontSize="lg" mt={6}>
          Nu există task-uri pentru filtrarea selectată.
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {tasks.map((task) => (
            <Card key={task.id} border="1px solid #ddd">
              <CardBody>
                <Heading size="md" mb={2}>
                  {task.titlu}
                </Heading>
                <Text mb={4} color="gray.600">
                  {task.descriere}
                </Text>

                <Flex gap={2} mb={3} wrap="wrap">
                  <Badge
                    colorScheme={
                      task.status === "DONE"
                        ? "green"
                        : task.status === "IN_PROGRESS"
                        ? "yellow"
                        : "blue"
                    }
                  >
                    {task.status}
                  </Badge>

                  <Badge
                    colorScheme={
                      task.prioritate === "HIGH"
                        ? "red"
                        : task.prioritate === "MEDIUM"
                        ? "orange"
                        : "gray"
                    }
                  >
                    {task.prioritate}
                  </Badge>

                  {task.categorie && (
                    <Badge colorScheme="purple">{task.categorie}</Badge>
                  )}
                </Flex>

                <Text fontSize="sm">Creat: {task.dataCreare}</Text>
                <Text fontSize="sm">Deadline: {task.dataLimita}</Text>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
