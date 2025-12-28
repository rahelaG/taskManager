import { Box, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { useAuth } from "../../context/AuthContext";
import { useTasks } from "../../hooks/useTasks";
import TaskFiltersBar from "./TaskFiltersBar";
import TaskList from "./TaskList";

export default function TasksContainer() {
  const { user } = useAuth();
  const { tasks, loading, filters, setFilters, fetchTasks } = useTasks();

  if (loading) {
    return (
      <Flex align="center" justify="center" height="70vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={8}>
      {/* HEADER */}
      <Heading mb={4}>
        👋 Salut,{" "}
        <Text as="span" color="blue.500">
          {user?.nume}
        </Text>
        !
      </Heading>

      <Text fontSize="lg" mb={6}>
        Aici vezi toate task-urile tale.
      </Text>

      {/* FILTRE */}
      <TaskFiltersBar
        filters={filters}
        onChange={setFilters}
        onApply={fetchTasks}
      />

      {/* LISTA */}
      <TaskList tasks={tasks} />
    </Box>
  );
}
