import { Box, Heading, Spinner, Card, CardBody } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import TaskForm from "../tasks/TaskForm";
import TaskAssignForm from "./TaskAssignForm";
import { useEditorTaskEdit } from "../../hooks/useEditorTaskEdit";

export default function EditorTaskEditContainer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { loading, users, task, updateTask, assignTask } =
    useEditorTaskEdit(id);

  if (loading) {
    return (
      <Box textAlign="center" mt={20}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={8}>
      <Heading mb={6}>Edit Task #{id}</Heading>

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
