# PeerConnect - Peer Tutoring Platform

**PeerConnect** is a full-stack web application designed for college students to get help in technical subjects from senior student tutors.

---

## Tech Stack

### Frontend
- **React.js** (Vite)
- **React Router DOM** (`react-router-dom`)
- **Axios**
- **Vanilla CSS** (Clean, responsive UI without Tailwind CSS or external UI libraries)

### Backend
- **Node.js** & **Express.js** (ES Modules `import`/`export`)
- **MySQL** (`mysql2/promise`)
- **bcrypt** for password hashing
- **cors** & **dotenv**
- *No JWT, No cookies, No complex RBAC* (Direct database email/password verification and `localStorage` session handling for beginner simplicity)

---

## Database Setup

1. Open **MySQL Workbench** or **MySQL Command Line Client**.
2. Run the SQL statements from [`backend/schema.sql`](file:///c:/Users/bhavesh/VT_project/backend/schema.sql).

Alternatively, run from your terminal:
```bash
mysql -u root -p < backend/schema.sql
```

---

## Environment Configuration

Configure your MySQL password in `backend/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_actual_mysql_password
DB_NAME=peer_tutoring
```

---

## How to Run the Project

### 1. Start Backend Server
```bash
cd backend
npm run dev
```
Backend runs at: `http://localhost:5000`

### 2. Start Frontend App
In a separate terminal:
```bash
cd frontend
npm run dev
```
Frontend runs at: `http://localhost:3000`
