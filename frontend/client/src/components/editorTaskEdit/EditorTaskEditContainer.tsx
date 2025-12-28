import { Box, Heading, Spinner } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useEditorTaskEdit } from "../../hooks/useEditorTaskEdit";
import TaskEditForm from "./TaskEditForm";
import TaskAssignForm from "./TaskAssignForm";

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

      <TaskEditForm
        task={task}
        onSubmit={async (values) => {
          await updateTask(values);
          navigate("/editor/tasks");
        }}
      />

      <TaskAssignForm
        users={users}
        currentUserId={task?.idCreator}
        onSubmit={assignTask}
      />
    </Box>
  );
}
