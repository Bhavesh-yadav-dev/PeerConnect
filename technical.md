# PeerConnect - Technical Documentation

## 1. System Overview

**PeerConnect** is a full-stack peer tutoring web application designed to connect college students seeking academic support with senior student tutors.

### Key Architectural Characteristics
* **Backend Architecture**: Layered Modular Express.js (`Route -> Controller -> Service -> Database`).
* **Frontend Architecture**: React Single Page Application (SPA) with `react-router-dom` and Vanilla CSS design tokens.
* **Authentication Model**: Direct database authentication using `bcrypt` password hashing without JWT or session cookies. Client session state is stored in `localStorage`.
* **Privacy Controls**: Strict API-level masking of tutor contact details (Gmail and Instagram username) until a help request is explicitly marked as `ACCEPTED` by the target tutor.

---

## 2. Technology Stack & Dependencies

### Backend Stack (`/backend`)
| Library | Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | `>= 18.x` | Runtime Environment |
| **Express.js** | `^4.19.2` | Web Framework (ES Modules `import`/`export`) |
| **mysql2** | `^3.10.0` | MySQL Driver with async/await Promises support (`mysql2/promise`) |
| **bcrypt** | `^5.1.1` | Password Hashing & Verification |
| **cors** | `^2.8.5` | Cross-Origin Resource Sharing Middleware |
| **dotenv** | `^16.4.5` | Environment Variable Management |

### Frontend Stack (`/frontend`)
| Library | Version | Purpose |
| :--- | :--- | :--- |
| **React** | `^18.3.1` | UI Library |
| **React Router DOM** | `^6.24.1` | Declarative Routing & Protected Route Guards |
| **Axios** | `^1.7.2` | HTTP Client for API Requests |
| **Vite** | `^5.3.1` | Build Tool & Fast Local Development Server |
| **Vanilla CSS** | Native | Responsive styling with custom CSS properties & media queries |

---

## 3. Directory Structure

```text
VT_project/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MySQL Connection Pool
│   │   ├── controllers/
│   │   │   ├── authController.js     # Auth endpoint handlers
│   │   │   ├── studentController.js  # Student tutor discovery handlers
│   │   │   ├── tutorController.js    # Tutor profile handlers
│   │   │   └── requestController.js  # Help request handlers
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # /api/auth routes
│   │   │   ├── studentRoutes.js      # /api/students routes
│   │   │   ├── tutorRoutes.js        # /api/tutors routes
│   │   │   └── requestRoutes.js      # /api/requests routes
│   │   ├── services/
│   │   │   ├── authService.js        # User creation & verification logic
│   │   │   ├── tutorService.js       # Tutor queries & update logic
│   │   │   └── requestService.js     # Help request SQL & status logic
│   │   ├── app.js                    # Express app initialization & routes mounting
│   │   └── server.js                 # HTTP server listener (Port 5000)
│   ├── .env                          # Environment variables
│   ├── schema.sql                    # MySQL Database schema definitions
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Dynamic responsive navigation bar
│   │   │   ├── ProtectedRoute.jsx    # Role-based route protection component
│   │   │   └── TutorCard.jsx         # Card component displaying tutor overview
│   │   ├── pages/
│   │   │   ├── Home.jsx              # Landing page
│   │   │   ├── Register.jsx          # Dual-role registration page
│   │   │   ├── StudentLogin.jsx      # Student login page
│   │   │   ├── TutorLogin.jsx        # Tutor login page
│   │   │   ├── StudentDashboard.jsx  # Student tutor discovery interface
│   │   │   ├── TutorProfile.jsx      # Student view of single tutor profile
│   │   │   ├── RequestHelp.jsx       # Help request message creation form
│   │   │   ├── MyRequests.jsx        # Student sent requests page with contact unsealing
│   │   │   ├── TutorDashboard.jsx    # Tutor request review (Accept/Reject) page
│   │   │   └── TutorProfileEdit.jsx  # Tutor profile editing interface
│   │   ├── services/
│   │   │   └── api.js                # Configured Axios instance
│   │   ├── App.jsx                   # Main React Router configuration
│   │   ├── main.jsx                  # React application entrypoint
│   │   └── index.css                 # Global Vanilla CSS styling & responsive media queries
│   ├── index.html
│   ├── vite.config.js                # Vite server configuration (Port 3000)
│   └── package.json
│
├── README.md                         # General execution instructions
└── technical.md                      # Complete technical specification
```

---

## 4. Database Architecture & Schema (`peer_tutoring`)

### Relational Entity Diagram

```
 [users] (1) ──── (1) [student_profiles]
    │
    │ (1) ─────── (1) [tutor_profiles]
    │
    ├─ (1) ─────── (N) [help_requests] (as student_id)
    └─ (1) ─────── (N) [help_requests] (as tutor_id)
```

### SQL DDL Schema (`backend/schema.sql`)

```sql
CREATE DATABASE IF NOT EXISTS peer_tutoring;
USE peer_tutoring;

-- Core Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  semester VARCHAR(20) NOT NULL,
  branch VARCHAR(50) NOT NULL,
  account_type ENUM('STUDENT', 'TUTOR') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student Profiles Table
CREATE TABLE IF NOT EXISTS student_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  interests TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tutor Profiles Table
CREATE TABLE IF NOT EXISTS tutor_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  subjects TEXT NOT NULL,
  preferred_time VARCHAR(100) NOT NULL,
  bio TEXT,
  contact_email VARCHAR(150) NOT NULL,
  instagram VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Help Requests Table
CREATE TABLE IF NOT EXISTS help_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  tutor_id INT NOT NULL,
  message TEXT NOT NULL,
  status ENUM('PENDING', 'ACCEPTED', 'REJECTED') DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 5. API Endpoint Specifications

### 5.1 Authentication (`/api/auth`)

#### `POST /api/auth/register`
Creates a user in `users` and inserts a matching profile into `student_profiles` or `tutor_profiles` inside a MySQL database transaction.

* **Request Body (Student Example)**:
  ```json
  {
    "name": "Rahul Sharma",
    "email": "rahul@gmail.com",
    "password": "secretpassword",
    "semester": "3rd",
    "branch": "CSE",
    "account_type": "STUDENT",
    "interests": "Data Structures, React"
  }
  ```

* **Request Body (Tutor Example)**:
  ```json
  {
    "name": "Bhavesh Yadav",
    "email": "bhavesh@gmail.com",
    "password": "secretpassword",
    "semester": "5th",
    "branch": "CSE",
    "account_type": "TUTOR",
    "subjects": "DSA, C++, React, Node.js",
    "preferred_time": "5 PM - 8 PM",
    "contact_email": "bhavesh.tutor@gmail.com",
    "instagram": "@bhaveshyadav",
    "bio": "Senior student specializing in algorithmic problem solving."
  }
  ```

* **Response (`201 Created`)**:
  ```json
  {
    "message": "Registration successful",
    "user": {
      "id": 1,
      "name": "Bhavesh Yadav",
      "email": "bhavesh@gmail.com",
      "semester": "5th",
      "branch": "CSE",
      "account_type": "TUTOR"
    }
  }
  ```

#### `POST /api/auth/login`
Verifies user email and bcrypt password.

* **Request Body**:
  ```json
  {
    "email": "bhavesh@gmail.com",
    "password": "secretpassword"
  }
  ```

* **Response (`200 OK`)**:
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": 1,
      "name": "Bhavesh Yadav",
      "email": "bhavesh@gmail.com",
      "semester": "5th",
      "branch": "CSE",
      "account_type": "TUTOR"
    }
  }
  ```

---

### 5.2 Student APIs (`/api/students`)

#### `GET /api/students/tutors?student_id={id}`
Returns all registered tutor accounts excluding the currently logged-in student user.

* **Response (`200 OK`)**:
  ```json
  [
    {
      "id": 1,
      "name": "Bhavesh Yadav",
      "semester": "5th",
      "branch": "CSE",
      "subjects": "DSA, C++, React, Node.js",
      "preferred_time": "5 PM – 8 PM",
      "bio": "Senior student specializing in algorithmic problem solving."
    }
  ]
  ```

#### `GET /api/students/tutors/:id`
Returns public profile of a single tutor (excludes contact email & instagram).

#### `GET /api/students/requests?student_id={id}`
Returns all requests sent by the student. Uses SQL `CASE WHEN status = 'ACCEPTED'` logic to conditionally return contact details.

* **Response (`200 OK`)**:
  ```json
  [
    {
      "id": 10,
      "tutor_id": 1,
      "tutor_name": "Bhavesh Yadav",
      "tutor_semester": "5th",
      "tutor_branch": "CSE",
      "tutor_subjects": "DSA, C++, React",
      "message": "I need help understanding recursion and backtracking in DSA.",
      "status": "ACCEPTED",
      "created_at": "2026-09-19T07:50:00.000Z",
      "contact_email": "bhavesh.tutor@gmail.com",
      "instagram": "@bhaveshyadav"
    }
  ]
  ```

---

### 5.3 Tutor APIs (`/api/tutors`)

#### `GET /api/tutors/profile?user_id={id}`
Returns full editable profile for the logged-in tutor.

#### `PUT /api/tutors/profile`
Updates `users` table (`name`, `semester`, `branch`) and `tutor_profiles` table (`subjects`, `preferred_time`, `contact_email`, `instagram`, `bio`) atomically.

#### `GET /api/tutors/requests?tutor_id={id}`
Returns all help requests sent to the tutor by students.

---

### 5.4 Help Request APIs (`/api/requests`)

#### `POST /api/requests`
Creates a help request with initial status `PENDING`.

* **Request Body**:
  ```json
  {
    "student_id": 2,
    "tutor_id": 1,
    "message": "I need help understanding recursion and backtracking in DSA."
  }
  ```

#### `PUT /api/requests/:id/accept`
Updates request status to `ACCEPTED` if `tutor_id` matches the request owner.

#### `PUT /api/requests/:id/reject`
Updates request status to `REJECTED` if `tutor_id` matches the request owner.

---

## 6. Privacy & Security Implementation

1. **Password Hashing**: Passwords are hashed using `bcrypt` (10 salt rounds) before database storage. Passwords are never returned in any API query responses.
2. **Conditional Privacy Unsealing**: Contact details (`contact_email` and `instagram`) are masked in MySQL via conditional projections:
   ```sql
   CASE WHEN hr.status = 'ACCEPTED' THEN tp.contact_email ELSE NULL END AS contact_email,
   CASE WHEN hr.status = 'ACCEPTED' THEN tp.instagram ELSE NULL END AS instagram
   ```
3. **Role Validation**: Frontend `ProtectedRoute.jsx` checks the user's `account_type` stored in `localStorage` to restrict access to student and tutor routes.

---

## 7. Responsive CSS Design System

The application uses standard Vanilla CSS defined in [`frontend/src/index.css`](file:///c:/Users/bhavesh/VT_project/frontend/src/index.css):

* **Color Palette Tokens**:
  - Primary Color: `#2563eb` (Hover `#1d4ed8`)
  - Background: `#f8fafc`
  - Status Badges:
    - Pending: `#fef3c7` / text `#92400e`
    - Accepted: `#dcfce7` / text `#166534`
    - Rejected: `#fee2e2` / text `#991b1b`
* **Mobile Breakpoint (`@media (max-width: 640px)`)**:
  - Flexbox header converts to vertical stacked column layout.
  - Multi-column form grids (`.form-grid-2`) collapse into single column layouts.
  - Cards and action buttons scale to `100%` width with touch-friendly spacing.
