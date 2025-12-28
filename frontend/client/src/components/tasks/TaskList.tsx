import { SimpleGrid, Text } from "@chakra-ui/react";
import type { Task } from "../../types/task";
import TaskCard from "./TaskCard";

type Props = {
  tasks: Task[];
};

export default function TaskList({ tasks }: Props) {
  if (tasks.length === 0) {
    return (
      <Text fontSize="lg" mt={6}>
        Nu există task-uri pentru filtrarea selectată.
      </Text>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </SimpleGrid>
  );
}
