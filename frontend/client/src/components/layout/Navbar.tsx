import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Text,
  useDisclosure,
  Stack,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, logout } = useAuth();
  const location = useLocation();
  const { colorMode, toggleColorMode } = useColorMode();

  const bg = useColorModeValue("blue.600", "gray.800");
  const textColor = useColorModeValue("white", "gray.100");
  // const hoverBg = useColorModeValue("whiteAlpha.300", "whiteAlpha.200");

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <Box bg={bg} px={4} mb={6}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Text
          as={RouterLink}
          to="/"
          fontSize="xl"
          fontWeight="bold"
          color={textColor}
        >
          TaskManager
        </Text>

        <HStack spacing={6} display={{ base: "none", md: "flex" }}>
          {user?.rol === "ROLE_USER" && (
            <Button
              as={RouterLink}
              to="/tasks"
              variant="ghost"
              color={textColor}
            >
              My Tasks
            </Button>
          )}

          {user?.rol === "ROLE_EDITOR" && (
            <Button
              as={RouterLink}
              to="/editor/projects"
              variant="ghost"
              color={textColor}
            >
              My Projects
            </Button>
          )}

          {user?.rol === "ROLE_ADMIN" && (
            <>
              <Button
                as={RouterLink}
                to="/admin/dashboard"
                variant="ghost"
                color={textColor}
              >
                Dashboard
              </Button>
              <Button
                as={RouterLink}
                to="/admin/users"
                variant="ghost"
                color={textColor}
              >
                Users
              </Button>
              <Button
                as={RouterLink}
                to="/admin/projects"
                variant="ghost"
                color={textColor}
              >
                Projects
              </Button>
            </>
          )}

          <IconButton
            aria-label="Toggle dark mode"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            color={textColor}
          />

          <Button
            variant="outline"
            color={textColor}
            borderColor={textColor}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </HStack>

        <IconButton
          display={{ md: "none" }}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          onClick={isOpen ? onClose : onOpen}
          aria-label="Menu"
          variant="ghost"
          color={textColor}
        />
      </Flex>

      {isOpen && (
        <Box pb={4} display={{ md: "none" }}>
          <Stack spacing={3}>
            {user?.rol === "ROLE_EDITOR" && (
              <Button as={RouterLink} to="/editor/projects">
                My Projects
              </Button>
            )}
            <Button onClick={toggleColorMode}>
              {colorMode === "light" ? "Dark" : "Light"} Mode
            </Button>
            <Button colorScheme="red" onClick={handleLogout}>
              Logout
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
