import { SimpleGrid, Text } from "@chakra-ui/react";
import type { Task } from "../../types/task";
import EditorTaskCard from "./EditorTaskCard";

type Props = {
  tasks: Task[];
  userMap: Record<number, string>;
  onDelete: (id: number) => void;
};

export default function EditorTaskList({ tasks, userMap, onDelete }: Props) {
  if (tasks.length === 0) {
    return <Text>No tasks found.</Text>;
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
      {tasks.map((task) => (
        <EditorTaskCard
          key={task.id}
          task={task}
          assignedTo={userMap[task.idCreator]}
          onDelete={onDelete}
        />
      ))}
    </SimpleGrid>
  );
}
