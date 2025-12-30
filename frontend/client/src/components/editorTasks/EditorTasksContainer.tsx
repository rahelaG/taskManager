import { Box, Button, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useEditorTasks } from "../../hooks/useEditorTasks";
import EditorTaskList from "./EditorTaskList";

export default function EditorTasksContainer() {
  const { projectId } = useParams<{ projectId: string }>();

  const { tasks, loading, userMap, deleteTask } = useEditorTasks(
    Number(projectId)
  );

  if (!projectId) {
    return (
      <Box p={8}>
        <Text color="red.500">Project not specified</Text>
      </Box>
    );
  }

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
        <Heading>Project Tasks</Heading>

        <Button
          colorScheme="blue"
          as={RouterLink}
          to={`/editor/projects/${projectId}/tasks/create`}
        >
          + Create Task
        </Button>
      </Flex>

      {tasks.length === 0 ? (
        <Text>No tasks found for this project.</Text>
      ) : (
        <EditorTaskList tasks={tasks} userMap={userMap} onDelete={deleteTask} />
      )}
    </Box>
  );
}
