import {
  Card,
  CardBody,
  Heading,
  Text,
  Badge,
  Stack,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import type { Project } from "../../types/project";

type Props = {
  project: Project & {
    editorUtilizator?: string; // 🔥 opțional, UX friendly
  };
  onEdit: (p: Project) => void;
  onChangeStatus: (p: Project) => void;
  onDelete: (p: Project) => void;
};

export default function AdminProjectCard({
  project,
  onEdit,
  onChangeStatus,
  onDelete,
}: Props) {
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
            Editor:{" "}
            <strong>
              {project.editorUtilizator
                ? project.editorUtilizator
                : `#${project.editorId}`}
            </strong>
          </Text>

          <ButtonGroup size="sm" mt={2}>
            <Button colorScheme="blue" onClick={() => onEdit(project)}>
              Edit
            </Button>

            <Button
              colorScheme="orange"
              //variant="outline"
              onClick={() => onChangeStatus(project)}
            >
              Status
            </Button>

            <Button colorScheme="red" onClick={() => onDelete(project)}>
              Delete
            </Button>
          </ButtonGroup>
        </Stack>
      </CardBody>
    </Card>
  );
}
