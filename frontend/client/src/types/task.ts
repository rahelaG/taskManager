export interface Task {
  id: number;
  titlu: string;
  descriere: string;
  status: "TODO" | "IN_PROGRESS" | "DONE" | string;
  prioritate: "LOW" | "MEDIUM" | "HIGH" | string;
  categorie: string;
  dataCreare: string;
  dataLimita: string;
  idCreator: number;
}


export interface TaskFilters {
  status: string;
  prioritate: string;
  categorie: string;
}
