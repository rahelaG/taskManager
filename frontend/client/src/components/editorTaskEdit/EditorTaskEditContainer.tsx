import { Box, Heading, Spinner, Card, CardBody, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

import TaskForm from "../tasks/TaskForm";
import TaskAssignForm from "./TaskAssignForm";
import { useEditorTaskEdit } from "../../hooks/useEditorTaskEdit";
import { useProjectContext } from "../../context/ProjectContext";

export default function EditorTaskEditContainer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProject } = useProjectContext();

  const { loading, users, task, updateTask, assignTask } =
    useEditorTaskEdit(id);

  // 🔒 dacă nu există project selectat → redirect
  useEffect(() => {
    if (!currentProject) {
      navigate("/editor/tasks");
    }
  }, [currentProject, navigate]);

  if (!currentProject) {
    return (
      <Box p={8}>
        <Heading mb={4}>Edit Task</Heading>
        <Text color="red.500">
          Please select a project before editing a task.
        </Text>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box textAlign="center" mt={20}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!task) {
    return (
      <Box p={8}>
        <Text color="red.500">Task not found.</Text>
      </Box>
    );
  }

  return (
    <Box p={8}>
      <Heading mb={2}>Edit Task #{id}</Heading>
      <Text color="gray.500" mb={6}>
        Project: <strong>{currentProject.nume}</strong>
      </Text>

      {/* UPDATE TASK */}
      <Card mb={10}>
        <CardBody>
          <TaskForm
            submitLabel="Save changes"
            defaultValues={{
              titlu: task.titlu,
              descriere: task.descriere,
              status: task.status,
              prioritate: task.prioritate,
              categorie: task.categorie || "",
              dataLimita: task.dataLimita || "",
            }}
            onSubmit={async (values) => {
              await updateTask({
                ...values,
                dataLimita: values.dataLimita || null,
              });
              navigate("/editor/tasks");
            }}
          />
        </CardBody>
      </Card>

      {/* ASSIGN TASK */}
      <TaskAssignForm
        users={users}
        currentUserId={task.idCreator}
        onSubmit={assignTask}
      />
    </Box>
  );
}
