import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { projectService } from "../services/projectService";
import type { Project } from "../types/project";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchProjects = async () => {
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch {
      toast({
        title: "Error loading projects",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
  };
}
