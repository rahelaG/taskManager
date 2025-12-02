import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Text,
  useDisclosure,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, logout } = useAuth();
  const location = useLocation(); // ⭐ necesar pentru a ascunde navbarul

  // ⭐ Ascundem navbarul pe login & register
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <Box bg="blue.600" px={4} mb={6}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        {/* LOGO */}
        <Text
          as={RouterLink}
          to="/tasks"
          fontSize="xl"
          fontWeight="bold"
          color="white"
        >
          TaskManager
        </Text>

        {/* MENIU DESKTOP */}
        <HStack
          spacing={8}
          alignItems={"center"}
          display={{ base: "none", md: "flex" }}
        >
          {user?.rol === "ROLE_USER" && (
            <Button
              as={RouterLink}
              to="/tasks"
              colorScheme="whiteAlpha"
              variant="ghost"
            >
              My Tasks
            </Button>
          )}

          {user?.rol === "ROLE_EDITOR" && (
            <Button
              as={RouterLink}
              to="/editor/tasks"
              colorScheme="whiteAlpha"
              variant="ghost"
            >
              Editor Tasks
            </Button>
          )}

          {user?.rol === "ROLE_ADMIN" && (
            <>
              <Button
                as={RouterLink}
                to="/admin/dashboard"
                colorScheme="whiteAlpha"
                variant="ghost"
              >
                Admin Dashboard
              </Button>
              <Button
                as={RouterLink}
                to="/admin/users"
                colorScheme="whiteAlpha"
                variant="ghost"
              >
                Users
              </Button>
            </>
          )}

          {/* LOGOUT */}
          <Button
            colorScheme="whiteAlpha"
            variant="outline"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </HStack>

        {/* BUTON MOBIL */}
        <IconButton
          size={"md"}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={"Open Menu"}
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
          color="white"
          variant="ghost"
        />
      </Flex>

      {/* MENIU MOBIL */}
      {isOpen ? (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as={"nav"} spacing={4}>
            {user?.rol === "ROLE_USER" && (
              <Button as={RouterLink} to="/tasks" variant="ghost">
                My Tasks
              </Button>
            )}

            {user?.rol === "ROLE_EDITOR" && (
              <Button as={RouterLink} to="/editor/tasks" variant="ghost">
                Editor Tasks
              </Button>
            )}

            {user?.rol === "ROLE_ADMIN" && (
              <>
                <Button as={RouterLink} to="/admin/dashboard" variant="ghost">
                  Admin Dashboard
                </Button>
                <Button as={RouterLink} to="/admin/users" variant="ghost">
                  Users
                </Button>
              </>
            )}

            <Button colorScheme="red" onClick={handleLogout}>
              Logout
            </Button>
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}
