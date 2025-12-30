import { Card, CardBody, Heading, Text, Badge, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import type { Project } from "../../types/project";
import { useAuth } from "../../context/AuthContext";

type Props = {
  project: Project;
};

export default function ProjectCard({ project }: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Card border="1px solid #e2e8f0">
      <CardBody>
        <Heading size="md">{project.nume}</Heading>

        <Text mt={2} color="gray.600">
          {project.descriere}
        </Text>

        <Badge
          mt={3}
          colorScheme={project.status === "ACTIVE" ? "green" : "gray"}
        >
          {project.status}
        </Badge>

        {/* DOAR EDITOR */}
        {user?.rol === "ROLE_EDITOR" && (
          <Button
            mt={4}
            colorScheme="blue"
            onClick={() => navigate(`/editor/projects/${project.id}/tasks`)}
          >
            Open project
          </Button>
        )}
      </CardBody>
    </Card>
  );
}
