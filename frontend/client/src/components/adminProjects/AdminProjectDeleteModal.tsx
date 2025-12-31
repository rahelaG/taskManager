import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
} from "@chakra-ui/react";
import { api } from "../../services/api";
import type { Project } from "../../types/project";

type Props = {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void;
};

export default function AdminProjectDeleteModal({
  project,
  isOpen,
  onClose,
  onDeleted,
}: Props) {
  if (!project) return null;

  const handleDelete = async () => {
    try {
      await api.delete(`/api/projects/${project.id}`);
      onDeleted();
      onClose();
    } catch (err) {
      console.error("Failed to delete project", err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Project</ModalHeader>

        <ModalBody>
          <Text>
            Are you sure you want to delete project{" "}
            <strong>{project.nume}</strong>?
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={handleDelete}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
