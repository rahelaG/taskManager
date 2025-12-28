import { Badge, Card, CardBody, Flex, Heading, Text } from "@chakra-ui/react";
import type { Task } from "../../types/task";

type Props = {
  task: Task;
};

function statusColor(status: string) {
  if (status === "DONE") return "green";
  if (status === "IN_PROGRESS") return "yellow";
  return "blue";
}

function priorityColor(prioritate: string) {
  if (prioritate === "HIGH") return "red";
  if (prioritate === "MEDIUM") return "orange";
  return "gray";
}

export default function TaskCard({ task }: Props) {
  return (
    <Card border="1px solid #ddd">
      <CardBody>
        <Heading size="md" mb={2}>
          {task.titlu}
        </Heading>

        <Text mb={4} color="gray.600">
          {task.descriere}
        </Text>

        <Flex gap={2} mb={3} wrap="wrap">
          <Badge colorScheme={statusColor(task.status)}>{task.status}</Badge>
          <Badge colorScheme={priorityColor(task.prioritate)}>
            {task.prioritate}
          </Badge>
          {task.categorie && (
            <Badge colorScheme="purple">{task.categorie}</Badge>
          )}
        </Flex>

        <Text fontSize="sm">Creat: {task.dataCreare}</Text>
        <Text fontSize="sm">Deadline: {task.dataLimita}</Text>
      </CardBody>
    </Card>
  );
}
