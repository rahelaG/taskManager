import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  Spinner,
  useToast,
  Text,
  Badge,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../services/api";

import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Chart.js register
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

interface TopUser {
  nume: string;
  rol: string;
  total: number;
}

interface RecentTask {
  titlu: string;
  status: string;
  dataCreare: string;
}

interface DashboardStats {
  totalUsers: number;
  totalTasks: number;
  tasksTodo: number;
  tasksInProgress: number;
  tasksDone: number;

  usersRoleUser: number;
  usersRoleEditor: number;
  usersRoleAdmin: number;

  priorityHigh: number;
  priorityMedium: number;
  priorityLow: number;

  topUsers: TopUser[];
  recentTasks: RecentTask[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const loadStats = async () => {
    try {
      const response = await api.get("/api/admin/dashboard");
      setStats(response.data);
    } catch (err) {
      toast({
        title: "Eroare la încărcarea dashboard-ului",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading || !stats) {
    return (
      <Flex align="center" justify="center" height="70vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  // ------------------------------
  // GRAPHS
  // ------------------------------
  const taskStatusChart = {
    labels: ["TODO", "IN PROGRESS", "DONE"],
    datasets: [
      {
        label: "Tasks",
        data: [stats.tasksTodo, stats.tasksInProgress, stats.tasksDone],
        backgroundColor: ["#3182CE", "#D69E2E", "#38A169"],
        borderRadius: 6,
      },
    ],
  };

  const priorityChart = {
    labels: ["HIGH", "MEDIUM", "LOW"],
    datasets: [
      {
        data: [stats.priorityHigh, stats.priorityMedium, stats.priorityLow],
        backgroundColor: ["#E53E3E", "#DD6B20", "#718096"],
      },
    ],
  };

  const roleChart = {
    labels: ["USER", "EDITOR", "ADMIN"],
    datasets: [
      {
        data: [
          stats.usersRoleUser,
          stats.usersRoleEditor,
          stats.usersRoleAdmin,
        ],
        backgroundColor: ["#4299E1", "#9F7AEA", "#ED8936"],
      },
    ],
  };

  return (
    <Box p={8}>
      <Heading mb={6}>Admin Dashboard</Heading>

      {/* ---------------------------------- */}
      {/* TOP STATS CARDS */}
      {/* ---------------------------------- */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={10}>
        <Card bg="blue.500" color="white">
          <CardBody>
            <Stat>
              <StatLabel>Total Users</StatLabel>
              <StatNumber>{stats.totalUsers}</StatNumber>
            </Stat>
          </CardBody>
        </Card>

        <Card bg="purple.500" color="white">
          <CardBody>
            <Stat>
              <StatLabel>Total Tasks</StatLabel>
              <StatNumber>{stats.totalTasks}</StatNumber>
            </Stat>
          </CardBody>
        </Card>

        <Card bg="yellow.500" color="white">
          <CardBody>
            <Stat>
              <StatLabel>Tasks In Progress</StatLabel>
              <StatNumber>{stats.tasksInProgress}</StatNumber>
            </Stat>
          </CardBody>
        </Card>

        <Card bg="green.500" color="white">
          <CardBody>
            <Stat>
              <StatLabel>Tasks Done</StatLabel>
              <StatNumber>{stats.tasksDone}</StatNumber>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* ---------------------------------- */}
      {/* CHARTS SECTION */}
      {/* ---------------------------------- */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={12}>
        {/* STATUS BAR CHART */}
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>
              Task Status
            </Heading>
            <Bar data={taskStatusChart} />
          </CardBody>
        </Card>

        {/* PRIORITY PIE */}
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>
              Tasks by Priority
            </Heading>
            <Pie data={priorityChart} />
          </CardBody>
        </Card>

        {/* ROLE PIE */}
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>
              Users by Role
            </Heading>
            <Pie data={roleChart} />
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* ---------------------------------- */}
      {/* TOP USERS */}
      {/* ---------------------------------- */}
      <Heading size="lg" mb={4}>
        Top 5 Users – Most Assigned Tasks
      </Heading>

      <Card mb={12}>
        <CardBody>
          {stats.topUsers.length === 0 ? (
            <Text>No assigned tasks yet.</Text>
          ) : (
            <VStack align="stretch" spacing={4}>
              {stats.topUsers.map((u, idx) => (
                <HStack
                  key={idx}
                  justify="space-between"
                  p={3}
                  borderBottom="1px solid #eee"
                >
                  <Box>
                    <Text fontWeight="bold">{u.nume}</Text>
                    <Badge colorScheme="purple">{u.rol}</Badge>
                  </Box>
                  <Stat>
                    <StatLabel>Tasks</StatLabel>
                    <StatNumber>{u.total}</StatNumber>
                  </Stat>
                </HStack>
              ))}
            </VStack>
          )}
        </CardBody>
      </Card>

      {/* ---------------------------------- */}
      {/* RECENT TASKS */}
      {/* ---------------------------------- */}
      <Heading size="lg" mb={4}>
        Recent Tasks Created
      </Heading>

      <Card>
        <CardBody>
          {stats.recentTasks.length === 0 ? (
            <Text>No recent tasks.</Text>
          ) : (
            <VStack align="stretch" spacing={4}>
              {stats.recentTasks.map((t, idx) => (
                <Box key={idx} p={3} borderBottom="1px solid #eee">
                  <Text fontWeight="bold">{t.titlu}</Text>
                  <Badge mt={1} colorScheme="blue">
                    {t.status}
                  </Badge>
                  <Text fontSize="sm">Created: {t.dataCreare}</Text>
                </Box>
              ))}
            </VStack>
          )}
        </CardBody>
      </Card>
    </Box>
  );
}
