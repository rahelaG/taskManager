import { Select } from "@chakra-ui/react";
import { useProjects } from "../../hooks/useProjects";
import { useProjectContext } from "../../context/ProjectContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProjectSelector() {
  const { projects } = useProjects();
  const { currentProject, setCurrentProject } = useProjectContext();
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Select
      placeholder="Select project"
      value={currentProject?.id ?? ""}
      onChange={(e) => {
        const project = projects.find((p) => p.id === Number(e.target.value));
        setCurrentProject(project ?? null);

        // dacă editor/admin selectează un proiect, îl ducem la editor tasks
        if (
          project &&
          (user?.rol === "ROLE_EDITOR" || user?.rol === "ROLE_ADMIN")
        ) {
          navigate("/editor/tasks");
        }
      }}
      maxW="300px"
      bg="white"
      color="black"
    >
      {projects.map((p) => (
        <option key={p.id} value={p.id}>
          {p.nume}
        </option>
      ))}
    </Select>
  );
}
