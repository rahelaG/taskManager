# ROUTES OVERVIEW (Before React Migration)

## 1. AUTH (Thymeleaf - HTML)

- GET `/login`
    - Controller: `LoginController.loginPage()`
    - View: `login.html`

- GET `/register`
    - Controller: `RegisterController.showRegisterForm()`
    - View: `register.html`

- POST `/register`
    - Controller: `RegisterController.processRegister()`
    - Logic: create user with ROLE_USER, then redirect to `/login`

- GET `/redirectByRole`
    - Controller: `RedirectController.redirectByRole()`
    - Logic: redirect to `/admin/dashboard`, `/editor/tasks` sau `/tasks` în funcție de rol


## 2. USER (Thymeleaf - HTML)

- GET `/tasks`
    - Controller: `TaskController.listTasks()`
    - View: `tasks-user.html`
    - Filtre: `status`, `prioritate`, `categorie` pentru userul logat


## 3. EDITOR (Thymeleaf - HTML)

- GET `/editor/tasks`
    - Controller: `EditorController.allTasks()`
    - View: `tasks-editor.html`
    - Filtre: `status`, `prioritate`, `categorie`

- GET `/editor/task/create`
    - Controller: `EditorController.createTaskForm()`
    - View: `editor-task-create.html`

- POST `/editor/task/save`
    - Controller: `EditorController.saveTask()`
    - Logic: salvează task nou și îl asociază la `userId`

- GET `/editor/task/edit/{id}`
    - Controller: `EditorController.editTaskForm()`
    - View: `editor-task-edit.html`

- POST `/editor/task/update`
    - Controller: `EditorController.updateTask()`

- GET `/editor/task/delete/{id}`
    - Controller: `EditorController.deleteTask()`

- POST `/editor/task/assign`
    - Controller: `EditorController.assignTask()`


## 4. ADMIN (Thymeleaf - HTML)

- GET `/admin/dashboard`
    - Controller: `AdminController.dashboard()`
    - View: `admin-dashboard.html`
    - Statistici: totalUsers, totalTasks, tasksTodo, tasksInProgress, tasksDone

- GET `/admin/users`
    - Controller: `AdminController.listUsers()`
    - View: `admin-users.html`

- GET `/admin/user/create`
    - Controller: `AdminController.createUserForm()`
    - View: `admin-user-create.html`

- POST `/admin/user/save`
    - Controller: `AdminController.saveUser()`

- GET `/admin/user/edit/{id}`
    - Controller: `AdminController.editUserForm()`
    - View: `admin-user-edit.html`

- POST `/admin/user/update`
    - Controller: `AdminController.updateUser()`

- POST `/admin/user/reset-password`
    - Controller: `AdminController.resetPassword()`

- GET `/admin/user/delete/{id}`
    - Controller: `AdminController.deleteUser()`


---

# API ROUTES (Used by React / Postman)

## AUTH

- GET `/api/auth/me`
    - Controller: `AuthRestController.getCurrentUser()`
    - Returnează: `{ id, username, nume, rol }` pentru userul logat


## USER API

- GET `/api/tasks`
    - Controller: `TaskRestController.getUserTasks()`
    - Filtre: `status`, `prioritate`, `categorie`
    - Returnează DOAR task-urile userului logat


## EDITOR API

- GET `/api/editor/tasks`
    - Controller: `TaskRestController.getEditorTasks()`
    - Returnează TOATE task-urile (filtration)

- POST `/api/editor/tasks`
    - Controller: `TaskRestController.createTask()`

- PUT `/api/editor/tasks/{id}`
    - Controller: `TaskRestController.updateTask()`

- DELETE `/api/editor/tasks/{id}`
    - Controller: `TaskRestController.deleteTask()`

- POST `/api/editor/tasks/{id}/assign?userId=...`
    - Controller: `TaskRestController.assignTask()`


## ADMIN API

- GET `/api/admin/users`
    - Controller: `AdminRestController.getAllUsers()`

- GET `/api/admin/users/{id}`
    - Controller: `AdminRestController.getUser()`

- POST `/api/admin/users`
    - Controller: `AdminRestController.createUser()`

- PUT `/api/admin/users/{id}`
    - Controller: `AdminRestController.updateUser()`

- DELETE `/api/admin/users/{id}`
    - Controller: `AdminRestController.deleteUser()`

- PUT `/api/admin/users/{id}/password`
    - Controller: `AdminRestController.resetPassword()`
