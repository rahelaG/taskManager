# Task & Project Management Application

A full-stack task and project management application built with **Spring Boot** and **React**, designed around a clean layered architecture, explicit domain modeling, and strict role-based access control.

The project focuses on correctness, maintainability, and real-world backend design practices.

---

## Core Functionality

### Authentication & Authorization
- Secure authentication using **Spring Security**
- Password hashing with **BCrypt**
- Session-based login
- Role-based access enforced at service level
- Supported roles:
    - **USER** – works on assigned tasks
    - **EDITOR** – manages projects and tasks
    - **ADMIN** – manages users and projects

---

### User Management (ADMIN)
- Create, update and delete users
- Assign roles (USER / EDITOR / ADMIN)
- Reset user passwords
- View all users
- View editor list (used for project assignment)
- Admin dashboard statistics:
    - total users
    - users grouped by role
    - latest registered users

---

### Project Management
- Create projects and assign an editor (ADMIN)
- Update project details and assigned editor (ADMIN)
- Change project status:PLANNED, ACTIVE, ON_HOLD, COMPLETED, ARCHIVED
- Delete projects (ADMIN)
- View all projects (ADMIN)
- View assigned projects (EDITOR)
- Access control enforced per project

---

### Task Management
- Tasks always belong to a project
- Create, update and delete tasks (EDITOR)
- Assign tasks to users (EDITOR)
- View tasks:
    - USER: only own tasks
    - EDITOR: tasks from assigned projects
- Filtering support:
    - status
    - priority
    - category
- Project state rules enforced:
    - tasks cannot be created, updated or assigned if the project is archived

---

## Architecture

### Backend (Spring Boot)
- Layered architecture:
    - Controller
    - Service
    - Repository
- Business logic isolated in the service layer
- Thin controllers
- DTO + Mapper pattern to isolate domain entities
- Custom exceptions for validation and access control
- JPA entity relationships:
    - User ↔ Project
    - Project ↔ Task
- Enums used for domain consistency:
    - `Role`
    - `ProjectStatus`
- Unit-tested service layer (JUnit + Mockito)

---

### Frontend (React)
- React with functional components
- Chakra UI for consistent and accessible UI
- Role-aware routing
- Centralized authentication context
- API communication via Axios
- Separation between pages, containers, hooks and services

---

## Technology Stack

### Backend
- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- MySQL
- Maven

### Frontend
- React
- Chakra UI
- Vite
- Axios

### Testing
- JUnit 5
- Mockito

---

## How to Run

- Clone the repository locally
- Run the Spring Boot backend (default port: 8080)
- Install dependencies and start the React frontend (Vite)
- Access the application via `http://localhost:5173`



## Design Goals

- Clear separation of concerns
- Explicit domain rules
- Predictable access control
- Testable business logic
- Codebase ready for extension (JWT, permissions, audit logging)

---

## Status

The project is functionally complete and structured to support future scalability and production-grade improvements.

