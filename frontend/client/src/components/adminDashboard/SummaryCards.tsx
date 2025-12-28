import {
  SimpleGrid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import type { DashboardStats } from "../../types/dashboard";

export default function SummaryCards({ stats }: { stats: DashboardStats }) {
  return (
    <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={10}>
      <Card bg="blue.600" color="white">
        <CardBody>
          <Stat>
            <StatLabel>Total Users</StatLabel>
            <StatNumber>{stats.totalUsers}</StatNumber>
          </Stat>
        </CardBody>
      </Card>

      <Card bg="blue.500" color="white">
        <CardBody>
          <Stat>
            <StatLabel>ROLE_USER</StatLabel>
            <StatNumber>{stats.usersRoleUser}</StatNumber>
          </Stat>
        </CardBody>
      </Card>

      <Card bg="purple.500" color="white">
        <CardBody>
          <Stat>
            <StatLabel>ROLE_EDITOR</StatLabel>
            <StatNumber>{stats.usersRoleEditor}</StatNumber>
          </Stat>
        </CardBody>
      </Card>

      <Card bg="orange.400" color="white">
        <CardBody>
          <Stat>
            <StatLabel>ROLE_ADMIN</StatLabel>
            <StatNumber>{stats.usersRoleAdmin}</StatNumber>
          </Stat>
        </CardBody>
      </Card>
    </SimpleGrid>
  );
}
