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
import { useState } from "react";
import { api } from "../../services/api";
import { useEditors } from "../../hooks/useEditors";
import { useToast } from "@chakra-ui/react";

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
  const toast = useToast();

  const { editors, loading: editorsLoading } = useEditors();

  const handleCreate = async () => {
    try {
      setLoading(true);

      await api.post("/api/projects", {
        nume,
        descriere,
        editorId: Number(editorId),
      });

      toast({
        title: "Project created",
        description: "The project was created successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onCreated();
      onClose();

      setNume("");
      setDescriere("");
      setEditorId("");
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create project.",
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
        <ModalHeader>Create Project</ModalHeader>

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
            onClick={handleCreate}
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
