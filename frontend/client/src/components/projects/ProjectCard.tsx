import { Card, CardBody, Heading, Text, Badge } from "@chakra-ui/react";
import type { Project } from "../../types/project";

type Props = {
  project: Project;
};

export default function ProjectCard({ project }: Props) {
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

        <Text fontSize="sm" mt={3}>
          Created: {project.dataCreare}
        </Text>
      </CardBody>
    </Card>
  );
}
