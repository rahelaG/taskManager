import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Flex,
  Spinner,
  useToast,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Link as RouterLink } from "react-router-dom";

interface User {
  id: number;
  nume: string;
  utilizator: string;
  rol: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState("");

  const toast = useToast();

  // ------------------------------------------------
  // FETCH ALL USERS
  // ------------------------------------------------
  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/admin/users");
      setUsers(response.data);
    } catch (err) {
      console.error("Error loading users", err);
      toast({ title: "Error loading users", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ------------------------------------------------
  // DELETE USER
  // ------------------------------------------------
  const deleteUser = async (id: number) => {
    if (!confirm("Sigur vrei să ștergi acest utilizator?")) return;

    try {
      await api.delete(`/api/admin/users/${id}`);
      toast({ title: "User deleted", status: "success" });
      fetchUsers();
    } catch {
      toast({ title: "Delete failed", status: "error" });
    }
  };

  // ------------------------------------------------
  // OPEN RESET PASSWORD MODAL
  // ------------------------------------------------
  const openResetModal = (userId: number) => {
    setSelectedUserId(userId);
    setNewPassword("");
    setIsOpen(true);
  };

  // ------------------------------------------------
  // RESET PASSWORD
  // ------------------------------------------------
  const handleResetPassword = async () => {
    if (!newPassword) {
      toast({ title: "Password cannot be empty", status: "warning" });
      return;
    }

    try {
      await api.put(`/api/admin/users/${selectedUserId}/password`, {
        newPassword: newPassword,
      });

      toast({ title: "Password updated", status: "success" });
      setIsOpen(false);
    } catch {
      toast({ title: "Reset failed", status: "error" });
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
      <Flex justify="space-between" mb={6}>
        <Heading>Admin – User Management</Heading>

        <Button as={RouterLink} colorScheme="blue" to="/admin/users/create">
          + Create User
        </Button>
      </Flex>

      <Table variant="striped">
        <Thead bg="gray.200">
          <Tr>
            <Th>ID</Th>
            <Th>Nume</Th>
            <Th>Username</Th>
            <Th>Rol</Th>
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
                  {/* Edit */}
                  <Button
                    as={RouterLink}
                    to={`/admin/users/${u.id}/edit`}
                    size="sm"
                    colorScheme="yellow"
                  >
                    Edit
                  </Button>

                  {/* Reset Password */}
                  <Button
                    size="sm"
                    colorScheme="purple"
                    onClick={() => openResetModal(u.id)}
                  >
                    Reset Password
                  </Button>

                  {/* Delete */}
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => deleteUser(u.id)}
                  >
                    Delete
                  </Button>
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* -------------------------------------------
          MODAL RESET PASSWORD
      -------------------------------------------- */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Resetare Parolă</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <FormControl>
              <FormLabel>Noua parolă</FormLabel>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleResetPassword}>
              Confirmă
            </Button>
            <Button onClick={() => setIsOpen(false)}>Anulează</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
