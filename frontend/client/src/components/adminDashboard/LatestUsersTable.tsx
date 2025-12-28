import {
  Card,
  CardBody,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  HStack,
  Box,
  Text,
  Badge,
} from "@chakra-ui/react";
import type { LatestUser } from "../../types/dashboard";

const roleColor = (rol: string) =>
  rol === "ROLE_ADMIN" ? "orange" : rol === "ROLE_EDITOR" ? "purple" : "blue";

export default function LatestUsersTable({ users }: { users: LatestUser[] }) {
  return (
    <Card flex="1">
      <CardBody>
        <Heading size="md" mb={4}>
          Latest Users
        </Heading>

        {users.length === 0 ? (
          <Text color="gray.500">No users available.</Text>
        ) : (
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Username</Th>
                <Th>Role</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((u) => (
                <Tr key={u.id}>
                  <Td>
                    <HStack spacing={3}>
                      <Avatar size="sm" name={u.nume} />
                      <Box>
                        <Text fontWeight="medium">{u.nume}</Text>
                        <Text fontSize="xs" color="gray.500">
                          ID: {u.id}
                        </Text>
                      </Box>
                    </HStack>
                  </Td>
                  <Td>{u.utilizator}</Td>
                  <Td>
                    <Badge colorScheme={roleColor(u.rol)}>
                      {u.rol.replace("ROLE_", "")}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
}
