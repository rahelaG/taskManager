import {
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Input,
  Select,
} from "@chakra-ui/react";
import type { TaskFilters } from "../../types/task";

type Props = {
  filters: TaskFilters;
  onChange: (next: TaskFilters) => void;
  onApply: () => void;
};

export default function TaskFiltersBar({ filters, onChange, onApply }: Props) {
  return (
    <Card mb={6}>
      <CardBody>
        <Heading size="md" mb={4}>
          Filtrează task-urile
        </Heading>

        <Flex gap={4} flexWrap="wrap">
          {/* STATUS */}
          <Select
            placeholder="Toate statusurile"
            w="200px"
            value={filters.status}
            onChange={(e) => onChange({ ...filters, status: e.target.value })}
          >
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="DONE">DONE</option>
          </Select>

          {/* PRIORITATE */}
          <Select
            placeholder="Toate prioritățile"
            w="200px"
            value={filters.prioritate}
            onChange={(e) =>
              onChange({ ...filters, prioritate: e.target.value })
            }
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </Select>

          {/* CATEGORIE */}
          <Input
            placeholder="Categorie..."
            w="200px"
            value={filters.categorie}
            onChange={(e) =>
              onChange({ ...filters, categorie: e.target.value })
            }
          />

          <Button colorScheme="blue" onClick={onApply}>
            Aplică filtre
          </Button>
        </Flex>
      </CardBody>
    </Card>
  );
}
