# VIT Course Registration System

Production-ready course registration system for VIT Vellore with modern layered architecture.

## Features

- **Authentication & Authorization**
  - JWT-based authentication (access + refresh tokens)
  - Google OAuth 2.0 integration
  - VIT college email restriction (`@vitstudent.ac.in`)
  - Password hashing with bcrypt
- **Student Management**
  - Register with email/password or Google
  - Profile management
  - Enrollment tracking with CGPA
- **Course Management**
  - Course catalog with offerings
  - Slot conflict detection
  - Seat availability tracking
- **Enrollment System**
  - Enroll/drop courses
  - Grade management & CGPA calculation
- **Faculty & Analytics**
  - Faculty administration
  - Dashboard analytics
  - Performance tracking

## Architecture

Refactored from monolith to scalable MVC:
- **Config**: Database connection, constants
- **Controllers**: HTTP request handlers
- **Services**: Business logic (testable, reusable)
- **Routes**: API endpoint mappings
- **Middleware**: Validation, error handling
- **Utils**: Helpers, validators

See `ARCHITECTURE.md` for detailed docs.

## Tech Stack

- **Runtime**: Node.js 16+
- **Framework**: Express.js 4.18
- **Database**: MongoDB Atlas (native driver)
- **Authentication**: 
  - JWT (jsonwebtoken)
  - Google OAuth 2.0 (Passport.js)
  - bcrypt password hashing
- **Session Management**: express-session + cookie-parser
- **Validation**: Custom middleware validators
- **CORS**: Configurable origin support

## Setup

### Prerequisites
- Node.js 16+
- MongoDB Atlas account

### Installation

```bash
npm install
```
### Run

**Development** (auto-reload):
```bash
npm run dev
```

**Production**:
```bash
npm start
```

**Seed Database**:
```bash
npm run seed
```

## API Endpoints

### Authentication 🔐

**Email/Password Auth**
- `POST /api/auth/register` - Register with college email
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout (invalidate client token)

**Google OAuth**
- `GET /api/auth/google` - Initiate Google OAuth flow
- `GET /api/auth/google/callback` - OAuth callback (automatic)

**Protected Routes** (requires `Authorization: Bearer <token>`)
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update current user profile

**Email Restriction**: Only `@vitstudent.ac.in` emails allowed for both registration and Google OAuth.

**Testing**: Run `node testAuth.js` to test all auth endpoints.

### Students
- `POST /api/students/register` - **DEPRECATED** - Use `/api/auth/register` instead
- `GET /api/students` - List all students (paginated)
- `GET /api/students/:id` - Get student details
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Courses
- `POST /api/courses` - Create course
- `GET /api/courses` - List all courses
- `GET /api/courses/:code` - Get course details

### Enrollments
- `POST /api/enrollments/enroll` - Enroll in course
- `POST /api/enrollments/:id/drop` - Drop course
- `PUT /api/enrollments/:id/grade` - Update grade
- `GET /api/enrollments/student/:studentId` - Student enrollments
- `GET /api/enrollments/course/:code/students` - Course students

### Faculty
- `POST /api/faculty` - Create faculty
- `GET /api/faculty` - List faculty

### Statistics
- `GET /api/stats/dashboard` - Dashboard stats
- `GET /api/stats/top-performers` - Top students

## File Structure

```
src/
├── config/
│   ├── database.js
│   └── constants.js
├── controllers/
│   ├── studentController.js
│   ├── courseController.js
│   └── ...
├── services/
│   ├── studentService.js
│   ├── courseService.js
│   └── ...
├── routes/
│   ├── studentRoutes.js
│   └── ...
├── middleware/
│   ├── errorHandler.js
│   └── validate.js
├── utils/
│   ├── helpers.js
│   └── validators.js
├── app.js
└── server.js
```

## Development

### Add New Feature

1. Create service method: `src/services/featureService.js`
2. Add controller: `src/controllers/featureController.js`
3. Create routes: `src/routes/featureRoutes.js`
4. Register in `src/routes/index.js`
5. Add validation: `src/middleware/validate.js`

### Error Handling

Throw AppError in services:
```javascript
throw new AppError('Invalid input', 400);
```

Errors automatically caught and formatted by error handler.

### Validation

Add middleware validators for new routes:
```javascript
router.post('/create', validateInput, controller.create);
```

## Testing

**Auth API Test Suite**:
```bash
npm run dev  # Start server first
node testAuth.js  # Run auth tests
```

**Manual Testing**:
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"registrationNumber":"21BCE1234","name":"John Doe","email":"john@vitstudent.ac.in","password":"Pass123","branch":"CSE"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@vitstudent.ac.in","password":"Pass123"}'

# Get Profile (use token from login response)
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```





## License

MIT

## Authors

-yuviios
