// Express application setup
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Root route
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>VIT Course Registration API</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
          h1 { color: #667eea; }
          .endpoint { background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 5px; }
          .method { display: inline-block; width: 80px; font-weight: bold; }
          .get { color: #10a37f; }
          .post { color: #ef4444; }
          .put { color: #f59e0b; }
          .delete { color: #dc2626; }
        </style>
      </head>
      <body>
        <h1>✅ VIT Course Registration System API</h1>
        <p>Server is running on port ${process.env.PORT || 3000}</p>

        <h2>📚 Available Endpoints:</h2>

        <h3>Students</h3>
        <div class="endpoint"><span class="method post">POST</span> /api/students/register</div>
        <div class="endpoint"><span class="method get">GET</span> /api/students</div>
        <div class="endpoint"><span class="method get">GET</span> /api/students/:id</div>
        <div class="endpoint"><span class="method put">PUT</span> /api/students/:id</div>
        <div class="endpoint"><span class="method delete">DELETE</span> /api/students/:id</div>

        <h3>Courses</h3>
        <div class="endpoint"><span class="method post">POST</span> /api/courses</div>
        <div class="endpoint"><span class="method get">GET</span> /api/courses</div>
        <div class="endpoint"><span class="method get">GET</span> /api/courses/:code</div>

        <h3>Course Offerings</h3>
        <div class="endpoint"><span class="method post">POST</span> /api/offerings</div>
        <div class="endpoint"><span class="method get">GET</span> /api/offerings/available</div>

        <h3>Enrollments</h3>
        <div class="endpoint"><span class="method post">POST</span> /api/enrollments/enroll</div>
        <div class="endpoint"><span class="method post">POST</span> /api/enrollments/:id/drop</div>
        <div class="endpoint"><span class="method put">PUT</span> /api/enrollments/:id/grade</div>
        <div class="endpoint"><span class="method get">GET</span> /api/enrollments/student/:studentId</div>
        <div class="endpoint"><span class="method get">GET</span> /api/enrollments/course/:code/students</div>

        <h3>Faculty</h3>
        <div class="endpoint"><span class="method post">POST</span> /api/faculty</div>
        <div class="endpoint"><span class="method get">GET</span> /api/faculty</div>

        <h3>Statistics</h3>
        <div class="endpoint"><span class="method get">GET</span> /api/stats/dashboard</div>
        <div class="endpoint"><span class="method get">GET</span> /api/stats/top-performers</div>
      </body>
    </html>
  `);
});

// API Routes
app.use('/api', routes);

// 404 Handler
app.use(notFoundHandler);

// Error Handler
app.use(errorHandler);

module.exports = app;
