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
  //Select,
} from "@chakra-ui/react";
import { useState } from "react";
import { api } from "../../services/api";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export default function AdminProjectCreateModal({
  isOpen,
  onClose,
  onCreated,
}: Props) {
  const [nume, setNume] = useState("");
  const [descriere, setDescriere] = useState("");
  const [editorId, setEditorId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post("/api/projects", {
        nume,
        descriere,
        editorId: Number(editorId),
      });

      onCreated();
      onClose();

      setNume("");
      setDescriere("");
      setEditorId("");
    } catch (err) {
      console.error("Failed to create project", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Project</ModalHeader>

        <ModalBody>
          <FormControl mb={3} isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              value={nume}
              onChange={(e) => setNume(e.target.value)}
              placeholder="Project name"
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={descriere}
              onChange={(e) => setDescriere(e.target.value)}
              placeholder="Optional description"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Editor ID</FormLabel>
            <Input
              value={editorId}
              onChange={(e) => setEditorId(e.target.value)}
              placeholder="Editor user ID"
              type="number"
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose} variant="ghost">
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={loading}
            isDisabled={!nume || !editorId}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
