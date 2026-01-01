import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import type { Project } from "../../types/project";
import { useToast } from "@chakra-ui/react";

type Props = {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
};

const STATUSES = ["PLANNED", "ACTIVE", "ON_HOLD", "COMPLETED", "ARCHIVED"];

export default function AdminProjectStatusModal({
  project,
  isOpen,
  onClose,
  onSaved,
}: Props) {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // 🔹 sincronizare când se deschide modalul
  useEffect(() => {
    if (project && isOpen) {
      setStatus(project.status);
    }
  }, [project, isOpen]);

  const handleSave = async () => {
    if (!project) return;

    try {
      setLoading(true);

      await api.put(`/api/projects/${project.id}/status`, {
        status,
      });

      toast({
        title: "Status updated",
        description: "Project status was updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onSaved();
      onClose();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update project status.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Change Project Status</ModalHeader>

        <ModalBody>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>

          <Button
            colorScheme="blue"
            onClick={handleSave}
            isLoading={loading}
            isDisabled={!status}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
