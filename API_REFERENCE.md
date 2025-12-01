# API Reference – Task Manager Backend
Documentație oficială pentru toate endpoint-urile REST folosite de frontend (React).

---

## 1. Authentication

### GET /api/auth/me
Returnează datele utilizatorului logat.

Response:
{
"id": 1,
"username": "john",
"nume": "John Doe",
"rol": "ROLE_USER"
}

---

## 2. User Authentication (HTML-based)

### POST /do-login
Autentificare utilizator (folosește sesiunea Spring Security).

### POST /register
Creează cont nou cu rol implicit ROLE_USER.

---

# 3. USER API (ROLE_USER)

### GET /api/tasks
Obține taskurile utilizatorului logat.

Query params:
- status
- prioritate
- categorie

---

# 4. EDITOR API (ROLE_EDITOR, ROLE_ADMIN)

### GET /api/editor/tasks
Returnează toate taskurile din sistem.

### POST /api/editor/tasks
Creează un task nou.

Body:
{
"titlu": "...",
"descriere": "...",
"prioritate": "...",
"status": "...",
"categorie": "...",
"idCreator": userId
}

### PUT /api/editor/tasks/{id}
Actualizează taskul.

### DELETE /api/editor/tasks/{id}
Șterge taskul.

### POST /api/editor/tasks/{id}/assign?userId={uid}
Atribuie taskul unui utilizator.

---

# 5. ADMIN API (ROLE_ADMIN)

## Users Management

### GET /api/admin/users
Returnează lista tuturor userilor.

### GET /api/admin/users/{id}
Returnează un user după id.

### POST /api/admin/users
Creează user nou.

### PUT /api/admin/users/{id}
Actualizează user.

### DELETE /api/admin/users/{id}
Șterge user.

### PUT /api/admin/users/{id}/password
Resetează parola userului.

Body:
"newPassword"

---

## Dashboard

### GET /api/admin/dashboard
Returnează statistici:
{
"totalUsers": 10,
"totalTasks": 50,
"tasksTodo": 15,
"tasksInProgress": 5,
"tasksDone": 30
}

---

# 6. System

### GET /api/ping
Response:
"ok"

---

# 7. Notes

- Toate parolele sunt criptate.
- Câmpul parola NU este expus în JSON (din motive de securitate).
- API-ul este protejat prin sesiune + BasicAuth (temporar).
- Va fi pregătit pentru JWT în Faza 7.
