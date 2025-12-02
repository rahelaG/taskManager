import { api } from "./api";

export interface Task {
  id: number;
  titlu: string;
  descriere: string;
  status: string;
  prioritate: string;
  categorie: string;
  dataLimita: string | null;
}

interface TaskFilters {
  status?: string;
  prioritate?: string;
  categorie?: string;
}

export const taskService = {
  async getUserTasks(filters: TaskFilters = {}) {
    const params = new URLSearchParams();

    if (filters.status) params.append("status", filters.status);
    if (filters.prioritate) params.append("prioritate", filters.prioritate);
    if (filters.categorie) params.append("categorie", filters.categorie);

    const response = await api.get(`/api/tasks?${params.toString()}`);
    return response.data as Task[];
  },
};
