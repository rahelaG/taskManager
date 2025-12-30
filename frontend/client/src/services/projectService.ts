import { api } from "./api";
import type { Project } from "../types/project";

export const projectService = {
  async getProjects(): Promise<Project[]> {
    const res = await api.get("/api/projects");
    return res.data;
  },
};
