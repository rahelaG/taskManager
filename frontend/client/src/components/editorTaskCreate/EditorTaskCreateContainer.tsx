import { Box, Card, CardBody, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import TaskForm from "../tasks/TaskForm";
import { useEditorTaskCreate } from "../../hooks/useEditorTaskCreate";

export default function EditorTaskCreateContainer() {
  const { users, createTask } = useEditorTaskCreate();
  const navigate = useNavigate();

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
              navigate("/editor/tasks");
            }}
          />
        </CardBody>
      </Card>
    </Box>
  );
}
