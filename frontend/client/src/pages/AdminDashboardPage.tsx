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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Badge,
  HStack,
  VStack,
  Text,
  Divider,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../services/api";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Tooltip, Legend, ArcElement);

// ------------------
// Types
// ------------------
interface LatestUser {
  id: number;
  nume: string;
  utilizator: string;
  rol: string;
}

interface DashboardStats {
  totalUsers: number;
  usersRoleUser: number;
  usersRoleEditor: number;
  usersRoleAdmin: number;
  latestUsers: LatestUser[];
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
        title: "Error loading admin dashboard",
        description: "Please try again or contact an administrator.",
        status: "error",
        duration: 4000,
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

  // ------------------
  // Charts config
  // ------------------
  const roleChart = {
    labels: ["ROLE_USER", "ROLE_EDITOR", "ROLE_ADMIN"],
    datasets: [
      {
        data: [
          stats.usersRoleUser,
          stats.usersRoleEditor,
          stats.usersRoleAdmin,
        ],
        backgroundColor: ["#3182CE", "#805AD5", "#ED8936"],
        borderWidth: 1,
      },
    ],
  };

  const totalRoles =
    stats.usersRoleUser + stats.usersRoleEditor + stats.usersRoleAdmin;

  const formatRoleLabel = (rol: string) => {
    switch (rol) {
      case "ROLE_ADMIN":
        return "Admin";
      case "ROLE_EDITOR":
        return "Editor";
      case "ROLE_USER":
      default:
        return "User";
    }
  };

  const roleColor = (rol: string) => {
    switch (rol) {
      case "ROLE_ADMIN":
        return "orange";
      case "ROLE_EDITOR":
        return "purple";
      case "ROLE_USER":
      default:
        return "blue";
    }
  };

  return (
    <Box p={{ base: 4, md: 8 }}>
      <HStack
        justify="space-between"
        align="center"
        mb={8}
        flexWrap="wrap"
        gap={4}
      >
        <Box>
          <Heading size="lg">Admin Dashboard</Heading>
          <Text mt={1} color="gray.500" fontSize="sm">
            Overview of users and roles in the system
          </Text>
        </Box>
      </HStack>

      {/* TOP SUMMARY CARDS */}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={10}>
        <Card bg="blue.600" color="white" shadow="lg" borderRadius="2xl">
          <CardBody>
            <Stat>
              <StatLabel fontSize="sm" color="blue.100">
                Total Users
              </StatLabel>
              <StatNumber fontSize="2xl">{stats.totalUsers}</StatNumber>
            </Stat>
          </CardBody>
        </Card>

        <Card bg="blue.500" color="white" shadow="lg" borderRadius="2xl">
          <CardBody>
            <Stat>
              <StatLabel fontSize="sm" color="blue.100">
                ROLE_USER
              </StatLabel>
              <StatNumber fontSize="xl">{stats.usersRoleUser}</StatNumber>
            </Stat>
          </CardBody>
        </Card>

        <Card bg="purple.500" color="white" shadow="lg" borderRadius="2xl">
          <CardBody>
            <Stat>
              <StatLabel fontSize="sm" color="purple.100">
                ROLE_EDITOR
              </StatLabel>
              <StatNumber fontSize="xl">{stats.usersRoleEditor}</StatNumber>
            </Stat>
          </CardBody>
        </Card>

        <Card bg="orange.400" color="white" shadow="lg" borderRadius="2xl">
          <CardBody>
            <Stat>
              <StatLabel fontSize="sm" color="orange.100">
                ROLE_ADMIN
              </StatLabel>
              <StatNumber fontSize="xl">{stats.usersRoleAdmin}</StatNumber>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* MAIN CONTENT AREA */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
        {/* USERS BY ROLE CHART + NUMBERS */}
        <Card shadow="md" borderRadius="2xl">
          <CardBody>
            <Heading size="md" mb={4}>
              Users by Role
            </Heading>
            <Flex
              direction={{ base: "column", md: "row" }}
              align="center"
              gap={6}
            >
              <Box flex="1">
                <Pie data={roleChart} />
              </Box>

              <Box flex="1">
                <Text fontSize="sm" mb={2} color="gray.600">
                  Distribution of users across roles
                </Text>
                <Divider mb={3} />
                <VStack align="stretch" spacing={2}>
                  <HStack justify="space-between">
                    <Text>ROLE_USER</Text>
                    <Text fontWeight="semibold">
                      {stats.usersRoleUser}{" "}
                      <Text as="span" fontSize="xs" color="gray.500">
                        (
                        {totalRoles > 0
                          ? Math.round((stats.usersRoleUser / totalRoles) * 100)
                          : 0}
                        %)
                      </Text>
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text>ROLE_EDITOR</Text>
                    <Text fontWeight="semibold">
                      {stats.usersRoleEditor}{" "}
                      <Text as="span" fontSize="xs" color="gray.500">
                        (
                        {totalRoles > 0
                          ? Math.round(
                              (stats.usersRoleEditor / totalRoles) * 100
                            )
                          : 0}
                        %)
                      </Text>
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text>ROLE_ADMIN</Text>
                    <Text fontWeight="semibold">
                      {stats.usersRoleAdmin}{" "}
                      <Text as="span" fontSize="xs" color="gray.500">
                        (
                        {totalRoles > 0
                          ? Math.round(
                              (stats.usersRoleAdmin / totalRoles) * 100
                            )
                          : 0}
                        %)
                      </Text>
                    </Text>
                  </HStack>
                </VStack>
              </Box>
            </Flex>
          </CardBody>
        </Card>

        {/* LATEST USERS TABLE */}
        <Card shadow="md" borderRadius="2xl">
          <CardBody>
            <Heading size="md" mb={4}>
              Latest Users
            </Heading>
            {stats.latestUsers.length === 0 ? (
              <Text color="gray.500">No users available.</Text>
            ) : (
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Username</Th>
                    <Th>Role</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {stats.latestUsers.map((user) => (
                    <Tr key={user.id}>
                      <Td>
                        <HStack spacing={3}>
                          <Avatar size="sm" name={user.nume} />
                          <Box>
                            <Text fontWeight="medium">{user.nume}</Text>
                            <Text fontSize="xs" color="gray.500">
                              ID: {user.id}
                            </Text>
                          </Box>
                        </HStack>
                      </Td>
                      <Td>{user.utilizator}</Td>
                      <Td>
                        <Badge
                          colorScheme={roleColor(user.rol)}
                          variant="subtle"
                        >
                          {formatRoleLabel(user.rol)}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
}
