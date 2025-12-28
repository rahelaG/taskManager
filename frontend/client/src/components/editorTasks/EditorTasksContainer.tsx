import { Box, Button, Flex, Heading, Spinner } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useEditorTasks } from "../../hooks/useEditorTasks";
import EditorTaskList from "./EditorTaskList";

export default function EditorTasksContainer() {
  const { tasks, loading, userMap, deleteTask } = useEditorTasks();

  if (loading) {
    return (
      <Flex align="center" justify="center" height="70vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={8}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading>Editor – All Tasks</Heading>

        <Button colorScheme="blue" as={RouterLink} to="/editor/tasks/create">
          + Create Task
        </Button>
      </Flex>

      <EditorTaskList tasks={tasks} userMap={userMap} onDelete={deleteTask} />
    </Box>
  );
}
