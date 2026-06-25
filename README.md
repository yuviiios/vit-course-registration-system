# VIT Course Registration System

Production-ready course registration system for VIT Vellore with modern layered architecture.

## Features

- Student management (register, profile, enrollments)
- Course catalog with offerings
- Enrollment system with slot conflict detection
- Grade management & CGPA calculation
- Faculty administration
- Dashboard analytics

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

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Auth**: bcrypt (passwords)
- **Validation**: Custom middleware validators

## Setup

### Prerequisites
- Node.js 16+
- MongoDB Atlas account

### Installation

```bash
npm install
```

### Environment

Create `.env`:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/vit_course_registration
PORT=3000
NODE_ENV=development
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

### Students
- `POST /api/students/register` - Register new student
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

Unit tests (future):
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

- Password hashing (bcrypt)
- Input validation middleware
- CORS enabled
- MongoDB injection prevention

## Future Enhancements

- JWT authentication
- Role-based access control
- Redis caching
- React frontend
- GraphQL support
- WebSocket notifications

## Documentation

- `ARCHITECTURE.md` - Detailed architecture
- `MIGRATION_GUIDE.md` - Refactor migration guide
- `REFACTOR_SUMMARY.md` - Refactoring overview

## License

MIT

## Authors

- Refactored Architecture Team (June 2026)
