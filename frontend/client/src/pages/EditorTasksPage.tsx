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

// ----------- INTERFETE -----------
interface Task {
  id: number;
  titlu: string;
  descriere: string;
  status: string;
  prioritate: string;
  categorie: string;
  dataCreare: string;
  dataLimita: string;
  idCreator: number;
}

interface User {
  id: number;
  nume: string;
  utilizator: string;
}

export default function EditorTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // MAPARE userId → nume
  const userMap = Object.fromEntries(
    users.map((u) => [u.id, `${u.nume} (${u.utilizator})`])
  );

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
    }
  };

  // ------------------------------------------------
  // FETCH USERS
  // ------------------------------------------------
  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/users/all");
      setUsers(response.data);
    } catch {
      toast({
        title: "Error loading users",
        status: "error",
      });
    }
  };

  useEffect(() => {
    Promise.all([fetchTasks(), fetchUsers()]).finally(() => setLoading(false));
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
      {/* HEADER + BUTTON CREATE */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading>Editor – All Tasks</Heading>

        <Button colorScheme="blue" as={RouterLink} to="/editor/tasks/create">
          + Create Task
        </Button>
      </Flex>

      {/* LISTA TASKURI */}
      {tasks.length === 0 ? (
        <Text>No tasks found.</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {tasks.map((task) => (
            <Card key={task.id} border="1px solid #e2e8f0">
              <CardBody>
                <Heading size="md">{task.titlu}</Heading>
                <Text mt={2} color="gray.600">
                  {task.descriere}
                </Text>

                <Flex gap={2} mt={3} wrap="wrap">
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

                {/* 🔥 USER ASSIGNED */}
                <Text fontSize="sm" mt={3} fontWeight="bold">
                  Assigned to: {userMap[task.idCreator] || "— Neasignat —"}
                </Text>

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
