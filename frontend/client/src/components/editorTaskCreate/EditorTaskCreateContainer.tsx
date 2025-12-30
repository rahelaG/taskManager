import { Box, Card, CardBody, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import TaskForm from "../tasks/TaskForm";
import { useEditorTaskCreate } from "../../hooks/useEditorTaskCreate";
import { useProjectContext } from "../../context/ProjectContext";
import { useEffect } from "react";

export default function EditorTaskCreateContainer() {
  const { users, createTask } = useEditorTaskCreate();
  const { currentProject } = useProjectContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentProject) {
      // dacă user intră direct pe url fără proiect, îl ducem înapoi
      navigate("/editor/tasks");
    }
  }, [currentProject, navigate]);

  if (!currentProject) {
    return (
      <Box p={8}>
        <Heading mb={4}>Create new task</Heading>
        <Text color="red.500">
          Please select a project from the navbar before creating a task.
        </Text>
      </Box>
    );
  }

  return (
    <Box p={8}>
      <Heading mb={6}>
        Create new task — <strong>{currentProject.nume}</strong>
      </Heading>

      <Card>
        <CardBody>
          <TaskForm
            users={users}
            submitLabel="Create Task"
            onSubmit={async (values) => {
              await createTask(values);
              navigate("/editor/tasks");
            }}
          />
        </CardBody>
      </Card>
    </Box>
  );
}
