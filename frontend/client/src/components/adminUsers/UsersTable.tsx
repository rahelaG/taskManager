import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import type { User } from "../../types/user";

type Props = {
  users: User[];
  onDelete: (id: number) => void;
  onResetPassword: (id: number) => void;
};

export default function UsersTable({
  users,
  onDelete,
  onResetPassword,
}: Props) {
  return (
    <Table variant="striped">
      <Thead bg="gray.200">
        <Tr>
          <Th>ID</Th>
          <Th>Name</Th>
          <Th>Username</Th>
          <Th>Role</Th>
          <Th textAlign="center">Actions</Th>
        </Tr>
      </Thead>

      <Tbody>
        {users.map((u) => (
          <Tr key={u.id}>
            <Td>{u.id}</Td>
            <Td>{u.nume}</Td>
            <Td>{u.utilizator}</Td>
            <Td>{u.rol}</Td>

            <Td>
              <Flex gap={2} justify="center">
                <Button
                  as={RouterLink}
                  to={`/admin/users/${u.id}/edit`}
                  size="sm"
                  colorScheme="yellow"
                >
                  Edit
                </Button>

                <Button
                  size="sm"
                  colorScheme="purple"
                  onClick={() => onResetPassword(u.id)}
                >
                  Reset Password
                </Button>

                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => onDelete(u.id)}
                >
                  Delete
                </Button>
              </Flex>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
