import {
  Card,
  CardBody,
  Heading,
  Flex,
  Box,
  Text,
  Divider,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { Pie } from "react-chartjs-2";
import type { DashboardStats } from "../../types/dashboard";

export default function UsersByRoleChart({ stats }: { stats: DashboardStats }) {
  const total =
    stats.usersRoleUser + stats.usersRoleEditor + stats.usersRoleAdmin;

  const chartData = {
    labels: ["ROLE_USER", "ROLE_EDITOR", "ROLE_ADMIN"],
    datasets: [
      {
        data: [
          stats.usersRoleUser,
          stats.usersRoleEditor,
          stats.usersRoleAdmin,
        ],
        backgroundColor: ["#3182CE", "#805AD5", "#ED8936"],
      },
    ],
  };

  return (
    <Card flex="1">
      <CardBody>
        <Heading size="md" mb={4}>
          Users by Role
        </Heading>

        <Flex direction={{ base: "column", md: "row" }} gap={6}>
          <Box flex="1">
            <Pie
              key="users-by-role"
              data={chartData}
              options={{ responsive: true }}
            />
          </Box>

          <Box flex="1">
            <Text fontSize="sm" mb={2} color="gray.600">
              Distribution of users across roles
            </Text>
            <Divider mb={3} />

            <VStack align="stretch" spacing={2}>
              {[
                ["ROLE_USER", stats.usersRoleUser],
                ["ROLE_EDITOR", stats.usersRoleEditor],
                ["ROLE_ADMIN", stats.usersRoleAdmin],
              ].map(([label, value]) => (
                <HStack key={label} justify="space-between">
                  <Text>{label}</Text>
                  <Text fontWeight="semibold">
                    {value} (
                    {total > 0 ? Math.round((Number(value) / total) * 100) : 0}
                    %)
                  </Text>
                </HStack>
              ))}
            </VStack>
          </Box>
        </Flex>
      </CardBody>
    </Card>
  );
}
