import { Box, Heading, Spinner, Flex } from "@chakra-ui/react";
import { useProjects } from "../../hooks/useProjects";
import ProjectList from "./ProjectList";

export default function ProjectsContainer() {
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
      <Heading mb={6}>Projects</Heading>
      <ProjectList projects={projects} />
    </Box>
  );
}
