import { Box, Button, Flex, Heading, Spinner } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import UsersTable from "./UsersTable";
import ResetPasswordModal from "./ResetPasswordModal";
import { useAdminUsers } from "../../hooks/useAdminUsers";

export default function AdminUsersContainer() {
  const { users, loading, deleteUser, resetPassword } = useAdminUsers();

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  if (loading) {
    return (
      <Flex align="center" justify="center" height="70vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={8}>
      <Flex justify="space-between" mb={6}>
        <Heading>Admin – User Management</Heading>

        <Button as={RouterLink} to="/admin/users/create" colorScheme="blue">
          + Create User
        </Button>
      </Flex>

      <UsersTable
        users={users}
        onDelete={deleteUser}
        onResetPassword={(id) => setSelectedUserId(id)}
      />

      <ResetPasswordModal
        userId={selectedUserId}
        onClose={() => setSelectedUserId(null)}
        onConfirm={resetPassword}
      />
    </Box>
  );
}
