import { SimpleGrid, Text } from "@chakra-ui/react";
import type { Project } from "../../types/project";
import AdminProjectCard from "./AdminProjectCard";

type Props = {
  projects: Project[];
  onEdit: (p: Project) => void;
  onChangeStatus: (p: Project) => void;
};

export default function AdminProjectList({
  projects,
  onEdit,
  onChangeStatus,
}: Props) {
  if (projects.length === 0) {
    return <Text>No projects found.</Text>;
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
      {projects.map((project) => (
        <AdminProjectCard
          key={project.id}
          project={project}
          onEdit={onEdit}
          onChangeStatus={onChangeStatus}
        />
      ))}
    </SimpleGrid>
  );
}
