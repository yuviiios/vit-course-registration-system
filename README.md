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

### Environment

Copy `.env.example` to `.env` and configure:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/vit_course_registration

# JWT (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars
JWT_REFRESH_EXPIRES_IN=30d

# Google OAuth (see GOOGLE_OAUTH_SETUP.md)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Session
SESSION_SECRET=your-session-secret-min-32-chars

# Frontend URL (for CORS and OAuth redirects)
FRONTEND_URL=http://localhost:5173
```

**⚠️ Important**: JWT secrets are already generated in `.env`. For Google OAuth, see `GOOGLE_OAUTH_SETUP.md`.

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

**Unit tests** (future):
```bash
npm test
```

## Deployment

### Docker
```bash
docker build -t vit-reg .
docker run -p 3000:3000 vit-reg
```

### Cloud
Works with AWS, Heroku, Vercel, Railway

## Performance

- Database indexes on key fields
- Pagination (default: 20, max: 100)
- Aggregation pipelines for analytics
- Parallel queries with Promise.all

## Security

- **Authentication**: JWT with access + refresh tokens (7d + 30d expiry)
- **Authorization**: Role-based access control (student role implemented)
- **Password Security**: bcrypt hashing (cost factor 12)
- **Email Restriction**: Only VIT college emails (`@vitstudent.ac.in`)
- **OAuth Security**: Google OAuth 2.0 with domain validation
- **Session Management**: Secure httpOnly cookies in production
- **CORS**: Configurable origin whitelist
- **Input Validation**: Custom middleware validators
- **MongoDB Injection Prevention**: Native driver with proper escaping
- **Token Storage**: Frontend should use httpOnly cookies or secure localStorage

## Future Enhancements

- ~~JWT authentication~~ ✅ **IMPLEMENTED**
- ~~Google OAuth~~ ✅ **IMPLEMENTED**
- Role-based access control (faculty/admin roles)
- Redis caching for sessions and stats
- React frontend with TailwindCSS
- GraphQL support
- WebSocket real-time notifications
- Email verification and password reset
- Rate limiting and API throttling
- Swagger/OpenAPI documentation
- Unit and integration tests (Jest + Supertest)
- Docker containerization
- CI/CD pipeline (GitHub Actions)

## Documentation

- `ARCHITECTURE.md` - Detailed architecture
- `GOOGLE_OAUTH_SETUP.md` - **Google OAuth configuration guide**
- `MIGRATION_GUIDE.md` - Refactor migration guide
- `REFACTOR_SUMMARY.md` - Refactoring overview
- `improvement.md` - Self-assessment and improvement roadmap

## License

MIT

## Authors

- Refactored Architecture Team (June 2026)
