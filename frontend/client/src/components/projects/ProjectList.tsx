import { SimpleGrid, Text } from "@chakra-ui/react";
import type { Project } from "../../types/project";
import ProjectCard from "./ProjectCard";

type Props = {
  projects: Project[];
};

export default function ProjectList({ projects }: Props) {
  if (projects.length === 0) {
    return <Text>No projects found.</Text>;
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </SimpleGrid>
  );
}
