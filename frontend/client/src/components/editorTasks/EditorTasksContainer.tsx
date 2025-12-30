import { Box, Button, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useEditorTasks } from "../../hooks/useEditorTasks";
import EditorTaskList from "./EditorTaskList";
import { useProjectContext } from "../../context/ProjectContext";

export default function EditorTasksContainer() {
  const { tasks, loading, userMap, deleteTask } = useEditorTasks();
  const { currentProject } = useProjectContext();

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
        <Heading>Editor – Tasks</Heading>

        <Button colorScheme="blue" as={RouterLink} to="/editor/tasks/create">
          + Create Task
        </Button>
      </Flex>

      {!currentProject ? (
        <Text color="gray.600">
          Select a project from the navbar to filter tasks.
        </Text>
      ) : null}

      <EditorTaskList tasks={tasks} userMap={userMap} onDelete={deleteTask} />
    </Box>
  );
}
