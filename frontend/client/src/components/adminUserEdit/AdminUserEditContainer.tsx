import { Box, Heading, Spinner, Card, CardBody } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdminUserEdit } from "../../hooks/useAdminUserEdit";
import UserDetailsForm from "./UserDetailsForm";
import UserPasswordForm from "./UserPasswordForm";

export default function AdminUserEditContainer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user, loading, updateUser, resetPassword } = useAdminUserEdit(id);

  if (loading || !user) {
    return (
      <Box textAlign="center" mt={20}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={8}>
      <Heading mb={6}>Edit user #{id}</Heading>

      <Card mb={8}>
        <CardBody>
          <UserDetailsForm
            user={user}
            onSubmit={async (values) => {
              await updateUser(values);
              navigate("/admin/users");
            }}
          />
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <UserPasswordForm onSubmit={resetPassword} />
        </CardBody>
      </Card>
    </Box>
  );
}
