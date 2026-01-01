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
  Select,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useEditors } from "../../hooks/useEditors";
import type { Project } from "../../types/project";
import { useToast } from "@chakra-ui/react";

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
  const toast = useToast();

  const { editors, loading: editorsLoading } = useEditors();

  useEffect(() => {
    if (project && isOpen) {
      setNume(project.nume);
      setDescriere(project.descriere ?? "");
      setEditorId(String(project.editorId));
    }
  }, [project, isOpen]);

  const handleSave = async () => {
    if (!project) return;

    try {
      setLoading(true);

      await api.put(`/api/projects/${project.id}`, {
        nume,
        descriere,
        editorId: Number(editorId),
      });

      toast({
        title: "Project updated",
        description: "Changes were saved successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onSaved();
      onClose();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update project.",
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
            <FormLabel>Editor</FormLabel>
            <Select
              placeholder="Select editor"
              value={editorId}
              onChange={(e) => setEditorId(e.target.value)}
              isDisabled={editorsLoading}
            >
              {editors.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.utilizator} (ID: {e.id})
                </option>
              ))}
            </Select>
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
