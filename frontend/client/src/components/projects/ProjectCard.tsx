import { Card, CardBody, Heading, Text, Badge } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import type { Project } from "../../types/project";

export default function ProjectCard({ project }: { project: Project }) {
  const navigate = useNavigate();

  return (
    <Card
      border="1px solid #e2e8f0"
      cursor="pointer"
      _hover={{ bg: "gray.50" }}
      onClick={() => navigate(`/editor/projects/${project.id}/tasks`)}
    >
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
      </CardBody>
    </Card>
  );
}
