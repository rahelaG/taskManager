import {
  Badge,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import type { Task } from "../../types/task";

type Props = {
  task: Task;
  assignedTo?: string;
  onDelete: (id: number) => void;
};

export default function EditorTaskCard({ task, assignedTo, onDelete }: Props) {
  return (
    <Card border="1px solid #e2e8f0">
      <CardBody>
        <Heading size="md">{task.titlu}</Heading>

        <Text mt={2} color="gray.600">
          {task.descriere}
        </Text>

        <Flex gap={2} mt={3} wrap="wrap">
          <Badge
            colorScheme={
              task.status === "DONE"
                ? "green"
                : task.status === "IN_PROGRESS"
                ? "yellow"
                : "blue"
            }
          >
            {task.status}
          </Badge>

          <Badge
            colorScheme={
              task.prioritate === "HIGH"
                ? "red"
                : task.prioritate === "MEDIUM"
                ? "orange"
                : "gray"
            }
          >
            {task.prioritate}
          </Badge>

          {task.categorie && (
            <Badge colorScheme="purple">{task.categorie}</Badge>
          )}
        </Flex>

        <Text fontSize="sm" mt={3} fontWeight="bold">
          Assigned to: {assignedTo || "— Unassigned —"}
        </Text>

        <Text fontSize="sm" mt={2}>
          Created: {task.dataCreare}
        </Text>
        <Text fontSize="sm">Deadline: {task.dataLimita}</Text>

        <Flex gap={2} mt={4}>
          <Button
            as={RouterLink}
            to={`/editor/tasks/${task.id}/edit`}
            colorScheme="yellow"
            size="sm"
          >
            Edit
          </Button>

          <Button colorScheme="red" size="sm" onClick={() => onDelete(task.id)}>
            Delete
          </Button>
        </Flex>
      </CardBody>
    </Card>
  );
}
