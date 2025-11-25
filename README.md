# 🗂️ Task Manager – Spring Boot Web Application

A complete Task / Project Management web application built with **Spring Boot**, using a clean layered architecture and secure role-based access control.

## 🚀 Features

### 🔐 Authentication & Roles
- Secure login with **Spring Security**
- Passwords encrypted using **BCrypt**
- Three roles:
    - **ROLE_USER** – can view and filter tasks
    - **ROLE_EDITOR** – can create, update, delete tasks
    - **ROLE_ADMIN** – can manage users and roles

### 📋 Task Management
- Create, edit, delete tasks (EDITOR & ADMIN)
- View and filter tasks (USER, EDITOR, ADMIN)
- Dynamic filtering by:
    - `status` (TODO, IN_PROGRESS, DONE)
    - `prioritate` (LOW, MEDIUM, HIGH)
    - `categorie` (Backend, Bug, Feature, etc.)
- Timestamps: creation date, optional deadline

### 🏗️ Architecture (recommended by the project specification)
- **Entity layer** – JPA entities (`User`, `Task`)
- **Repository layer** – Spring Data JPA
- **Service layer** – business logic
- **Controller layer** – HTTP endpoints (Spring MVC)
- **Security layer** – Spring Security configuration
- **Database** – MySQL (initialized via `data.sql`)

### 💻 Frontend
- Thymeleaf templates
- HTML/CSS
- Optional: Bootstrap for modern UI
- Optional: React version (future extension)

---

## 🛠️ Technologies Used

- **Java 17**
- **Spring Boot**
- Spring MVC
- Spring Data JPA
- Spring Security
- MySQL
- Maven
- Thymeleaf
- Lombok (optional)
- Git & GitHub

---

## 📁 Project Structure

