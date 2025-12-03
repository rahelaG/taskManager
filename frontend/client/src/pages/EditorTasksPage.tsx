import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  Card,
  CardBody,
  Badge,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Link as RouterLink } from "react-router-dom";

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

export default function EditorTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // ------------------------------------------------
  // FETCH TASKS
  // ------------------------------------------------
  const fetchTasks = async () => {
    try {
      const response = await api.get("/api/editor/tasks");
      setTasks(response.data);
    } catch (err) {
      console.error("Error fetching editor tasks:", err);
      toast({
        title: "Error loading tasks",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ------------------------------------------------
  // DELETE TASK
  // ------------------------------------------------
  const deleteTask = async (id: number) => {
    if (!confirm("Sigur vrei să ștergi acest task?")) return;

    try {
      await api.delete(`/api/editor/tasks/${id}`);
      toast({
        title: "Task deleted",
        status: "success",
      });
      fetchTasks(); // reload
    } catch (err) {
      console.error("Delete error:", err);
      toast({
        title: "Error deleting",
        status: "error",
      });
    }
  };

  // ------------------------------------------------
  // UI
  // ------------------------------------------------
  if (loading) {
    return (
      <Flex align="center" justify="center" height="70vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={8}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading>Editor – All Tasks</Heading>

        <Button colorScheme="blue" as={RouterLink} to="/editor/tasks/create">
          + Create Task
        </Button>
      </Flex>

      {tasks.length === 0 ? (
        <Text>No tasks found.</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {tasks.map((task) => (
            <Card key={task.id}>
              <CardBody>
                <Heading size="md">{task.titlu}</Heading>
                <Text mt={2} color="gray.600">
                  {task.descriere}
                </Text>

                <Flex gap={2} mt={3} wrap="wrap">
                  <Badge>{task.status}</Badge>
                  <Badge>{task.prioritate}</Badge>
                  {task.categorie && <Badge>{task.categorie}</Badge>}
                </Flex>

                <Text fontSize="sm" mt={2}>
                  Created: {task.dataCreare}
                </Text>
                <Text fontSize="sm">Deadline: {task.dataLimita}</Text>

                <Flex gap={2} mt={4}>
                  <Button
                    as={RouterLink}
                    to={`/editor/tasks/${task.id}/edit`}
                    colorScheme="yellow"
                    size="sm"
                  >
                    Edit
                  </Button>

                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </Button>
                </Flex>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
