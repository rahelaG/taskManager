import { Box, Card, CardBody, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAdminUserCreate } from "../../hooks/useAdminUserCreate";
import UserCreateForm from "./UserCreateForm";

export default function AdminUserCreateContainer() {
  const { createUser } = useAdminUserCreate();
  const navigate = useNavigate();

  return (
    <Box p={8}>
      <Heading mb={6}>Create new user</Heading>

      <Card>
        <CardBody>
          <UserCreateForm
            onSubmit={async (values) => {
              await createUser(values);
              navigate("/admin/users");
            }}
          />
        </CardBody>
      </Card>
    </Box>
  );
}
