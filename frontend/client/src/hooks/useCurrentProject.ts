import { useProjectContext } from "../context/ProjectContext";

export function useCurrentProject() {
  const { currentProject, setCurrentProject } = useProjectContext();

  if (!currentProject) {
    throw new Error("No project selected");
  }

  return {
    project: currentProject,
    setProject: setCurrentProject,
  };
}
