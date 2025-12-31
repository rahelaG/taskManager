import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import type { Project } from "../../types/project";

type Props = {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
};

export default function AdminProjectEditModal({
  project,
  isOpen,
  onClose,
  onSaved,
}: Props) {
  const [nume, setNume] = useState("");
  const [descriere, setDescriere] = useState("");
  const [editorId, setEditorId] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 sincronizăm state-ul când se schimbă proiectul
  useEffect(() => {
    if (!project) {
      setNume("");
      setDescriere("");
      setEditorId("");
      return;
    }

    setNume(project.nume);
    setDescriere(project.descriere ?? "");
    setEditorId(String(project.editorId));
  }, [project, isOpen]);

  const handleSave = async () => {
    if (!project) return; // ✅ guard corect

    setLoading(true);
    try {
      await api.put(`/api/projects/${project.id}`, {
        nume,
        descriere,
        editorId: Number(editorId),
      });

      onSaved();
      onClose();
    } catch (err) {
      console.error("Failed to update project", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Project</ModalHeader>

        <ModalBody>
          <FormControl mb={3} isRequired>
            <FormLabel>Name</FormLabel>
            <Input value={nume} onChange={(e) => setNume(e.target.value)} />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={descriere}
              onChange={(e) => setDescriere(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Editor ID</FormLabel>
            <Input
              type="number"
              value={editorId}
              onChange={(e) => setEditorId(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSave}
            isLoading={loading}
            isDisabled={!nume || !editorId}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
