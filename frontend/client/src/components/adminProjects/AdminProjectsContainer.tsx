import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Button,
  Spinner,
  Center,
  useDisclosure,
} from "@chakra-ui/react";
import { api } from "../../services/api";
import type { Project } from "../../types/project";
import AdminProjectList from "./AdminProjectList";
import AdminProjectCreateModal from "./AdminProjectCreateModal";

export default function AdminProjectsContainer() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get<Project[]>("/api/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Center h="60vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box p={8}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading>Projects</Heading>

        <Button colorScheme="blue" onClick={onOpen}>
          + Create Project
        </Button>
      </Flex>

      <AdminProjectList projects={projects} />

      <AdminProjectCreateModal
        isOpen={isOpen}
        onClose={onClose}
        onCreated={fetchProjects}
      />
    </Box>
  );
}
