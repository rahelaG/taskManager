import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// pagini publice
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

// pagini protejate
import TasksPage from "../pages/TasksPage";
import EditorTasksPage from "../pages/EditorTasksPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import AdminUsersPage from "../pages/AdminUsersPage";
import EditorTaskCreatePage from "../pages/EditorTaskCreatePage";
import EditorTaskEditPage from "../pages/EditorTaskEditPage";
import AdminUserCreatePage from "../pages/AdminUserCreatePage";
import AdminUserEditPage from "../pages/AdminUserEditPage";
import ProjectsPage from "../pages/ProjectsPage";

export default function AppRouter() {
  return (
    <Routes>
      {/* ---- PUBLIC ---- */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ---- USER ---- */}
      <Route
        path="/tasks"
        element={
          <ProtectedRoute
            allowedRoles={["ROLE_USER", "ROLE_EDITOR", "ROLE_ADMIN"]}
          >
            <TasksPage />
          </ProtectedRoute>
        }
      />

      {/* ---- EDITOR ---- */}
      <Route
        path="/editor/tasks"
        element={
          <ProtectedRoute allowedRoles={["ROLE_EDITOR", "ROLE_ADMIN"]}>
            <EditorTasksPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/editor/tasks/create"
        element={
          <ProtectedRoute allowedRoles={["ROLE_EDITOR", "ROLE_ADMIN"]}>
            <EditorTaskCreatePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/editor/tasks/:id/edit"
        element={
          <ProtectedRoute allowedRoles={["ROLE_EDITOR", "ROLE_ADMIN"]}>
            <EditorTaskEditPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_EDITOR"]}>
            <ProjectsPage />
          </ProtectedRoute>
        }
      />

      {/* ---- ADMIN ---- */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users/create"
        element={
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <AdminUserCreatePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <AdminUsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/:id/edit"
        element={
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <AdminUserEditPage />
          </ProtectedRoute>
        }
      />

      {/* ---- ROOT REDIRECT ---- */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ---- 404 ---- */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}
