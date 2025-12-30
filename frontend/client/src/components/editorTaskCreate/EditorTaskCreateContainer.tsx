import { Box, Card, CardBody, Heading } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import TaskForm from "../tasks/TaskForm";
import { useEditorTaskCreate } from "../../hooks/useEditorTaskCreate";

export default function EditorTaskCreateContainer() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { users, createTask } = useEditorTaskCreate(Number(projectId));

  return (
    <Box p={8}>
      <Heading mb={6}>Create new task</Heading>

      <Card>
        <CardBody>
          <TaskForm
            users={users}
            submitLabel="Create Task"
            onSubmit={async (values) => {
              await createTask(values);
              navigate(`/editor/projects/${projectId}/tasks`);
            }}
          />
        </CardBody>
      </Card>
    </Box>
  );
}
