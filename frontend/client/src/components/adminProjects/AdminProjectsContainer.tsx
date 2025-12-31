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

// ⚠️ FOARTE IMPORTANT
import AdminProjectList from "./AdminProjectList";
import AdminProjectCreateModal from "./AdminProjectCreateModal";
import AdminProjectEditModal from "./AdminProjectEditModal";
import AdminProjectStatusModal from "./AdminProjectStatusModal";

export default function AdminProjectsContainer() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const createModal = useDisclosure();
  const editModal = useDisclosure();
  const statusModal = useDisclosure();

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

        <Button colorScheme="blue" onClick={createModal.onOpen}>
          + Create Project
        </Button>
      </Flex>

      {/* 🔥 AICI E ESENȚIAL */}
      <AdminProjectList
        projects={projects}
        onEdit={(project) => {
          setSelectedProject(project);
          editModal.onOpen();
        }}
        onChangeStatus={(project) => {
          setSelectedProject(project);
          statusModal.onOpen();
        }}
      />

      <AdminProjectCreateModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        onCreated={fetchProjects}
      />

      <AdminProjectEditModal
        project={selectedProject}
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        onSaved={fetchProjects}
      />

      <AdminProjectStatusModal
        project={selectedProject}
        isOpen={statusModal.isOpen}
        onClose={statusModal.onClose}
        onSaved={fetchProjects}
      />
    </Box>
  );
}
