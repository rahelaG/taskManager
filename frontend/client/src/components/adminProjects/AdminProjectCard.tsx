import { Card, CardBody, Heading, Text, Badge, Stack } from "@chakra-ui/react";
import type { Project } from "../../types/project";

type Props = {
  project: Project;
};

export default function AdminProjectCard({ project }: Props) {
  const statusColor =
    project.status === "ACTIVE"
      ? "green"
      : project.status === "ON_HOLD"
      ? "orange"
      : project.status === "COMPLETED"
      ? "blue"
      : project.status === "ARCHIVED"
      ? "red"
      : "gray";

  return (
    <Card borderWidth="1px" borderRadius="md">
      <CardBody>
        <Stack spacing={3}>
          <Heading size="md">{project.nume}</Heading>

          {project.descriere && (
            <Text color="gray.600">{project.descriere}</Text>
          )}

          <Badge colorScheme={statusColor} width="fit-content">
            {project.status}
          </Badge>

          <Text fontSize="sm" color="gray.500">
            Editor ID: {project.editorId}
          </Text>
        </Stack>
      </CardBody>
    </Card>
  );
}
