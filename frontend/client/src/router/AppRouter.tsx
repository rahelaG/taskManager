import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// ================= PUBLIC =================
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

// ================= USER =================
import TasksPage from "../pages/TasksPage";

// ================= EDITOR =================
import EditorProjectsPage from "../pages/EditorProjectsPage";
import EditorTasksPage from "../pages/EditorTasksPage";
import EditorTaskCreatePage from "../pages/EditorTaskCreatePage";
import EditorTaskEditPage from "../pages/EditorTaskEditPage";

// ================= ADMIN =================
import AdminDashboardPage from "../pages/AdminDashboardPage";
import AdminUsersPage from "../pages/AdminUsersPage";
import AdminUserCreatePage from "../pages/AdminUserCreatePage";
import AdminUserEditPage from "../pages/AdminUserEditPage";
//import ProjectsPage from "../pages/ProjectsPage";
import AdminProjectsPage from "../pages/AdminProjectsPage";

export default function AppRouter() {
  return (
    <Routes>
      {/* ========== PUBLIC ========== */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ========== USER ========== */}
      <Route
        path="/tasks"
        element={
          <ProtectedRoute allowedRoles={["ROLE_USER"]}>
            <TasksPage />
          </ProtectedRoute>
        }
      />

      {/* ========== EDITOR ========== */}
      {/* 🔹 landing page editor → alege proiect */}
      <Route
        path="/editor/projects"
        element={
          <ProtectedRoute allowedRoles={["ROLE_EDITOR"]}>
            <EditorProjectsPage />
          </ProtectedRoute>
        }
      />

      {/* 🔹 task-urile unui proiect */}
      <Route
        path="/editor/projects/:projectId/tasks"
        element={
          <ProtectedRoute allowedRoles={["ROLE_EDITOR"]}>
            <EditorTasksPage />
          </ProtectedRoute>
        }
      />

      {/* 🔹 create task (projectId din URL) */}
      <Route
        path="/editor/projects/:projectId/tasks/create"
        element={
          <ProtectedRoute allowedRoles={["ROLE_EDITOR"]}>
            <EditorTaskCreatePage />
          </ProtectedRoute>
        }
      />

      {/* 🔹 edit task (projectId + taskId din URL) */}
      <Route
        path="/editor/projects/:projectId/tasks/:id/edit"
        element={
          <ProtectedRoute allowedRoles={["ROLE_EDITOR"]}>
            <EditorTaskEditPage />
          </ProtectedRoute>
        }
      />

      {/* ========== ADMIN ========== */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/projects"
        element={
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <AdminProjectsPage />
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
        path="/admin/users/create"
        element={
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <AdminUserCreatePage />
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

      {/* ========== ROOT & 404 ========== */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}
