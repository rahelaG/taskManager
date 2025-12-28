export interface LatestUser {
  id: number;
  nume: string;
  utilizator: string;
  rol: string;
}

export interface DashboardStats {
  totalUsers: number;
  usersRoleUser: number;
  usersRoleEditor: number;
  usersRoleAdmin: number;
  latestUsers: LatestUser[];
}
