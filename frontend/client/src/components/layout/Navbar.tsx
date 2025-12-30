// src/components/layout/Navbar.tsx
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
import ProjectSelector from "../projects/ProjectSelector";

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, logout } = useAuth();
  const location = useLocation();

  const { colorMode, toggleColorMode } = useColorMode();

  // 🎨 CULORI DINAMICE LIGHT / DARK
  const bg = useColorModeValue("blue.600", "gray.800");
  const textColor = useColorModeValue("white", "gray.100");
  const hoverBg = useColorModeValue("whiteAlpha.300", "whiteAlpha.200");

  // Ascundem navbarul pe login & register
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  const showProjectSelector =
    user?.rol === "ROLE_EDITOR" || user?.rol === "ROLE_ADMIN";

  return (
    <Box bg={bg} px={4} mb={6}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        {/* LOGO */}
        <Text
          as={RouterLink}
          to="/tasks"
          fontSize="xl"
          fontWeight="bold"
          color={textColor}
        >
          TaskManager
        </Text>

        {/* MENIU DESKTOP */}
        <HStack
          spacing={6}
          alignItems={"center"}
          display={{ base: "none", md: "flex" }}
        >
          {user?.rol === "ROLE_USER" && (
            <Button
              as={RouterLink}
              to="/tasks"
              color={textColor}
              variant="ghost"
              _hover={{ bg: hoverBg }}
            >
              My Tasks
            </Button>
          )}

          {user?.rol === "ROLE_EDITOR" && (
            <Button
              as={RouterLink}
              to="/editor/tasks"
              color={textColor}
              variant="ghost"
              _hover={{ bg: hoverBg }}
            >
              Editor Tasks
            </Button>
          )}

          {user?.rol === "ROLE_ADMIN" && (
            <>
              <Button
                as={RouterLink}
                to="/admin/dashboard"
                color={textColor}
                variant="ghost"
                _hover={{ bg: hoverBg }}
              >
                Admin Dashboard
              </Button>

              <Button
                as={RouterLink}
                to="/admin/users"
                color={textColor}
                variant="ghost"
                _hover={{ bg: hoverBg }}
              >
                Users
              </Button>
            </>
          )}

          {/* ✅ PROJECT SELECTOR (EDITOR/ADMIN) */}
          {showProjectSelector && <ProjectSelector />}

          {/* 🔘 SWITCH DARK MODE */}
          <IconButton
            aria-label="Toggle Dark Mode"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            color={textColor}
            _hover={{ bg: hoverBg }}
          />

          {/* 🚪 LOGOUT */}
          <Button
            variant="outline"
            color={textColor}
            borderColor={textColor}
            onClick={handleLogout}
            _hover={{ bg: hoverBg }}
          >
            Logout
          </Button>
        </HStack>

        {/* MENU MOBILE BUTTON */}
        <IconButton
          size={"md"}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={"Open Menu"}
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
          color={textColor}
          variant="ghost"
        />
      </Flex>

      {/* MENIU MOBILE */}
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

            {/* ✅ PROJECT SELECTOR (MOBILE) */}
            {showProjectSelector && <ProjectSelector />}

            {/* DARK MODE MOBILE */}
            <Button onClick={toggleColorMode} variant="ghost">
              {colorMode === "light" ? "Dark Mode" : "Light Mode"}
            </Button>

            <Button colorScheme="red" onClick={handleLogout}>
              Logout
            </Button>
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}
