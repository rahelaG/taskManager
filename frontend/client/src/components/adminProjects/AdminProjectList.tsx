import { SimpleGrid, Text } from "@chakra-ui/react";
import type { Project } from "../../types/project";
import AdminProjectCard from "./AdminProjectCard";

type Props = {
  projects: Project[];
};

export default function AdminProjectList({ projects }: Props) {
  if (projects.length === 0) {
    return <Text>No projects found.</Text>;
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
      {projects.map((project) => (
        <AdminProjectCard key={project.id} project={project} />
      ))}
    </SimpleGrid>
  );
}
