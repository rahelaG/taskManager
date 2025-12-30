import { Box, Heading, Spinner, Flex, Text } from "@chakra-ui/react";
import { useProjects } from "../hooks/useProjects";
import ProjectList from "../components/projects/ProjectList";

export default function EditorProjectsPage() {
  const { projects, loading } = useProjects();

  if (loading) {
    return (
      <Flex align="center" justify="center" height="70vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={8}>
      <Heading mb={6}>My Projects</Heading>

      {projects.length === 0 ? (
        <Text>No projects assigned.</Text>
      ) : (
        <ProjectList projects={projects} />
      )}
    </Box>
  );
}
