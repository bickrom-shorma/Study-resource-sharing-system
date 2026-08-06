# Study Resource Sharing System

A full-stack web application built for department students to upload, search, browse, view, and download study notes in PDF format.

## 🚀 Tech Stack

- **Frontend**: React (Vite), React Router v6, Axios, Lucide React Icons, Vanilla CSS Design System
- **Backend**: Node.js, Express.js
- **Database**: MySQL (with `mysql2` driver)
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs password hashing
- **File Storage**: Multer middleware for PDF uploads stored in `server/uploads`

---

## 📁 Project Structure

```
study-resource-sharing-system/
├── client/                     # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Navbar, Footer, NoteCard, ProtectedRoute
│   │   ├── context/            # AuthContext (JWT management & session state)
│   │   ├── pages/              # Home, Register, Login, BrowseNotes, UploadNote, MyNotes, PdfViewerPage, NotFound
│   │   ├── services/           # Axios API service
│   │   ├── index.css           # Glassmorphism design system & responsive layout
│   │   ├── App.jsx             # React Router navigation
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Express Backend
│   ├── config/                 # MySQL connection pool (db.js)
│   ├── controllers/            # authController, noteController, subjectController
│   ├── middleware/             # authMiddleware (JWT), uploadMiddleware (Multer PDF filter)
│   ├── routes/                 # authRoutes, noteRoutes, subjectRoutes
│   ├── uploads/                # PDF uploads storage directory
│   ├── schema.sql              # MySQL schema & initial seed data
│   ├── app.js                  # Express app middleware & error handlers
│   ├── server.js               # Entry point
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 🗄️ Database Setup (MySQL)

1. Open your MySQL client (or phpMyAdmin / MySQL Workbench).
2. Execute the `server/schema.sql` script to create the database and seed tables:

```sql
CREATE DATABASE IF NOT EXISTS study_resource_db;
```

Alternatively, when you start the server (`node server.js`), the database connection module will automatically attempt to create the `study_resource_db` database and run `schema.sql` automatically if credentials permit.

---

## ⚙️ Environment Variables

Configure `server/.env`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=study_resource_db
DB_PORT=3306
JWT_SECRET=super_secret_study_resource_jwt_key_2026
```

---

## 💻 Installation & Setup

### 1. Setup Backend (`server`)

```bash
cd server
npm install
npm run dev
```
The server will start at `http://localhost:5000`.

### 2. Setup Frontend (`client`)

```bash
cd client
npm install
npm run dev
```
The client will start at `http://localhost:3000`.

---

## 📑 REST API Documentation

### Authentication Routes
| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Register new student account | No |
| `POST` | `/api/auth/login` | Login and receive JWT token | No |
| `POST` | `/api/auth/logout` | Logout user | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (JWT) |

### Subjects & Topics Routes
| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `GET` | `/api/subjects` | Fetch all department subjects | No |
| `GET` | `/api/topics/:subjectId` | Fetch topics for a given subject ID | No |

### Notes Routes
| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `GET` | `/api/notes` | Fetch all study notes | No |
| `GET` | `/api/notes/search` | Search notes by `query`, `subject_id`, or `topic_id` | No |
| `GET` | `/api/notes/:id` | Fetch single note details | No |
| `GET` | `/api/notes/download/:id` | Stream & download note PDF file | No |
| `GET` | `/api/notes/my-notes` | Fetch notes uploaded by logged-in user | Yes (JWT) |
| `POST` | `/api/notes` | Upload note with PDF file (Multer) | Yes (JWT) |

---

## 👥 Features Summary

- **Guest Access**: Browse, search, view in PDF player, and download study notes without logging in.
- **Student Auth**: JWT & bcrypt password hashing for registration & login.
- **PDF Upload**: Strictly validated PDF file upload with title, subject, and topic assignment.
- **My Uploads**: Personal dashboard for managing uploaded notes.
- **PDF Viewer**: Embedded HTML5 viewer to read notes directly inside the application.
