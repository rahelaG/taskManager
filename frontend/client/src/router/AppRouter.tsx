import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// pagini publice
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

// pagini protejate
import TasksPage from "../pages/TasksPage";
import EditorTasksPage from "../pages/EditorTasksPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import AdminUsersPage from "../pages/AdminUsersPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
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
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />

        {/* fallback */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
