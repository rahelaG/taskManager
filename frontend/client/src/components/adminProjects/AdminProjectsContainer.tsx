import { useEffect, useState } from "react";
import { Box, Flex, Heading, Button, Spinner, Center } from "@chakra-ui/react";
import { api } from "../../services/api";
import type { Project } from "../../types/project";

export default function AdminProjectsContainer() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

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
    <Box px={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Projects</Heading>

        <Button colorScheme="blue">+ Create Project</Button>
      </Flex>

      {/* TEMPORAR: doar debug list */}
      <Box>
        {projects.map((p) => (
          <Box key={p.id} p={4} mb={3} borderWidth="1px" borderRadius="md">
            <strong>{p.nume}</strong> — {p.status}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
