import { Box, Flex, Heading, Spinner, Text, HStack } from "@chakra-ui/react";
import { useAdminDashboard } from "../../hooks/useAdminDashboard";
import SummaryCards from "./SummaryCards";
import UsersByRoleChart from "./UsersByRoleChart";
import LatestUsersTable from "./LatestUsersTable";

export default function AdminDashboardContainer() {
  const { stats, loading } = useAdminDashboard();

  console.log("AdminDashboard render", { loading, stats });

  if (loading) {
    return (
      <Flex align="center" justify="center" height="70vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!stats) {
    return (
      <Flex align="center" justify="center" height="70vh">
        <Box>
          <Text color="red.500">Dashboard data not available</Text>
        </Box>
      </Flex>
    );
  }

  return (
    <Box p={{ base: 4, md: 8 }}>
      <HStack justify="space-between" mb={8}>
        <Box>
          <Heading size="lg">Admin Dashboard</Heading>
          <Text mt={1} color="gray.500" fontSize="sm">
            Overview of users and roles in the system
          </Text>
        </Box>
      </HStack>

      <SummaryCards stats={stats} />

      <Flex direction={{ base: "column", lg: "row" }} gap={8}>
        <UsersByRoleChart stats={stats} />
        <LatestUsersTable users={stats.latestUsers} />
      </Flex>
    </Box>
  );
}
