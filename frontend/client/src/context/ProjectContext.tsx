import { createContext, useContext, useState } from "react";
import type { Project } from "../types/project";

type ProjectContextType = {
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  return (
    <ProjectContext.Provider value={{ currentProject, setCurrentProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectContext() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjectContext must be used inside ProjectProvider");
  }
  return context;
}
