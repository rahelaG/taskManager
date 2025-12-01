# Frontend Roadmap – React Migration

## 1. Public Pages
### • LoginPage
- POST /do-login

### • RegisterPage
- POST /register

## 2. User Pages (ROLE_USER)
### • TasksPage
- GET /api/tasks
- GET /api/auth/me

## 3. Editor Pages (ROLE_EDITOR, ROLE_ADMIN)
### • EditorTasksPage
- GET /api/editor/tasks
- GET /api/auth/me

### • EditorTaskCreatePage
- GET /api/admin/users
- POST /api/editor/tasks

### • EditorTaskEditPage
- GET /api/editor/tasks/{id}
- PUT /api/editor/tasks/{id}
- DELETE /api/editor/tasks/{id}
- POST /api/editor/tasks/{id}/assign
- GET /api/admin/users

## 4. Admin Pages (ROLE_ADMIN)
### • AdminUsersPage
- GET /api/admin/users
- DELETE /api/admin/users/{id}

### • AdminCreateUserPage
- POST /api/admin/users

### • AdminEditUserPage
- GET /api/admin/users/{id}
- PUT /api/admin/users/{id}
- PUT /api/admin/users/{id}/password

### • AdminDashboardPage
- GET /api/admin/dashboard

## 5. Notes
- Auth always: GET /api/auth/me
- All API secured via Session (later JWT)
