# VIT Course Registration System

A full-stack course registration platform inspired by VIT Vellore, built with React, Node.js, Express, and MongoDB.

The project demonstrates secure authentication, timetable parsing, course enrollment workflows, and a scalable backend architecture following the MVC pattern.

---

## Features

- 🔐 Google OAuth Authentication (Passport.js)
- 🔑 JWT-based Authentication
- 📅 Timetable HTML Import & Parsing
- ⚡ Automatic Timetable Conflict Detection
- 📚 Course Registration & Enrollment
- 👤 Student Profile Management
- 🛡️ Protected API Routes
- 🚦 Rate Limiting & Input Validation
- 📱 Responsive User Interface

---

## Architecture

The backend follows a layered MVC architecture to keep business logic independent from HTTP handlers.

```
Client (React)
        │
        ▼
 Express Routes
        │
        ▼
 Controllers
        │
        ▼
 Business Services
        │
        ▼
 MongoDB
```

### Project Structure

```
src/
├── config/
├── controllers/
├── middleware/
├── routes/
├── services/
├── utils/
├── models/
├── app.js
└── server.js
```

This separation makes the application easier to maintain, test, and extend.

---

# Authentication

The application supports two authentication methods:

- Email & Password
- Google OAuth (Passport.js)

Security measures include:

- Password hashing using bcrypt
- JWT authentication
- Protected routes
- Domain validation for VIT student accounts
- Rate limiting
- CORS configuration

---

# Timetable Parser

The application accepts the timetable HTML exported from VTOP and automatically:

- Extracts course information
- Identifies slots
- Detects timetable conflicts
- Generates a structured timetable for the dashboard

---

# Course Registration

Students can

- Browse available courses
- View seat availability
- Enroll in courses
- Drop registered courses
- Prevent timetable conflicts before enrollment

---

# Technology Stack

## Frontend

- React
- Vite
- Tailwind CSS
- React Router

## Backend

- Node.js
- Express.js
- Passport.js
- JWT
- Express Session

## Database

- MongoDB Atlas

## Authentication

- Google OAuth 2.0
- bcryptjs

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

# REST API

## Authentication

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/google
GET    /api/auth/google/callback
GET    /api/auth/me
```

## Courses

```
GET    /api/courses
POST   /api/enrollments/enroll
POST   /api/enrollments/:id/drop
```

## Timetable

```
POST   /api/timetable/upload
GET    /api/timetable
```

---

# Engineering Decisions

| Decision | Reason |
|----------|--------|
| Layered MVC | Better separation of concerns |
| JWT Authentication | Stateless authentication |
| Passport.js | Simplifies OAuth integration |
| MongoDB | Flexible document model for timetable and course data |
| Centralized Error Handler | Consistent API responses |
| Middleware-based Validation | Cleaner controllers |
| Environment Variables | Secure configuration management |

---

# Local Development

Clone the repository

```bash
git clone <repo-url>
```

Install dependencies

```bash
npm install
```

Start the backend

```bash
npm run dev
```

Start the frontend

```bash
npm run dev
```

---

# Environment Variables

```env
MONGODB_URI=
JWT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FRONTEND_URL=
SESSION_SECRET=
```

---

# Lessons Learned

Building this project helped strengthen my understanding of:

- Designing RESTful APIs
- OAuth authentication
- JWT-based authorization
- Backend architecture (MVC)
- Middleware design
- MongoDB schema design
- Secure authentication practices
- React state management
- Deployment using Vercel & Render

---

# Author

**Yuvios**


## License

MIT
