// ============================================
// VIT COURSE REGISTRATION SYSTEM - BACKEND
// Complete Node.js + Express + MongoDB Atlas
// ============================================

// server.js
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const uri = process.env.MONGODB_URI || "mongodb+srv://username:password@cluster.mongodb.net/";
const client = new MongoClient(uri);
let db;

// Connect to Database
async function connectDB() {
  try {
    await client.connect();
    db = client.db("vit_course_registration");
    console.log("✅ Connected to MongoDB Atlas");
    
    // Create indexes for better performance
    await createIndexes();
    
    return db;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

// Create Database Indexes
async function createIndexes() {
  await db.collection('students').createIndex({ registrationNumber: 1 }, { unique: true });
  await db.collection('students').createIndex({ email: 1 }, { unique: true });
  await db.collection('courses').createIndex({ courseCode: 1 }, { unique: true });
  await db.collection('enrollments').createIndex({ studentId: 1, offeringId: 1 }, { unique: true });
  await db.collection('courseOfferings').createIndex({ courseCode: 1, semester: 1, academicYear: 1 });
  console.log("✅ Database indexes created");
}

// Utility Functions
function generateId(prefix) {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `${prefix}${timestamp}${random}`.toUpperCase();
}

function calculateGrade(totalMarks) {
  if (totalMarks >= 90) return 'A+';
  if (totalMarks >= 80) return 'A';
  if (totalMarks >= 70) return 'B+';
  if (totalMarks >= 60) return 'B';
  if (totalMarks >= 50) return 'C';
  if (totalMarks >= 40) return 'D';
  return 'F';
}

function calculateCGPA(enrollments) {
  let totalCredits = 0;
  let weightedSum = 0;
  
  const gradePoints = {
    'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C+': 6, 'C': 5, 'D': 4, 'F': 0
  };
  
  enrollments.forEach(enrollment => {
    if (enrollment.grade && enrollment.grade !== '-') {
      const points = gradePoints[enrollment.grade] || 0;
      totalCredits += enrollment.credits;
      weightedSum += points * enrollment.credits;
    }
  });
  
  return totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : 0;
}

// ==========================================
// STUDENT ROUTES
// ==========================================

// Register New Student
app.post('/api/students/register', async (req, res) => {
  try {
    const { registrationNumber, name, email, password, phone, dateOfBirth, branch, semester, type } = req.body;
    
    // Validate required fields
    if (!registrationNumber || !name || !email || !password || !branch) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    // Check if student already exists
    const existing = await db.collection('students').findOne({
      $or: [{ registrationNumber }, { email }]
    });
    
    if (existing) {
      return res.status(400).json({ error: "Student with this registration number or email already exists" });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create student document
    const student = {
      studentId: generateId('S'),
      registrationNumber,
      name,
      email,
      password: hashedPassword,
      phone: phone || null,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      branch,
      semester: parseInt(semester) || 1,
      cgpa: 0,
      type: type || 'undergraduate',
      hostelBlock: null,
      researchArea: null,
      guideId: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('students').insertOne(student);
    
    // Remove password from response
    delete student.password;
    
    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      student: { ...student, _id: result.insertedId }
    });
    
  } catch (error) {
    console.error("Error registering student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get Student by ID
app.get('/api/students/:id', async (req, res) => {
  try {
    const student = await db.collection('students').findOne(
      { studentId: req.params.id },
      { projection: { password: 0 } }
    );
    
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    
    res.json({ success: true, student });
    
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update Student Profile
app.put('/api/students/:id', async (req, res) => {
  try {
    const { name, email, phone, hostelBlock, semester } = req.body;
    
    const updateData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(hostelBlock && { hostelBlock }),
      ...(semester && { semester: parseInt(semester) }),
      updatedAt: new Date()
    };
    
    const result = await db.collection('students').updateOne(
      { studentId: req.params.id },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    
    res.json({ success: true, message: "Student updated successfully" });
    
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get All Students (with pagination)
app.get('/api/students', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const branch = req.query.branch;
    const semester = req.query.semester;
    
    const query = {};
    if (branch) query.branch = branch;
    if (semester) query.semester = parseInt(semester);
    
    const students = await db.collection('students')
      .find(query, { projection: { password: 0 } })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    const total = await db.collection('students').countDocuments(query);
    
    res.json({
      success: true,
      students,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ==========================================
// COURSE ROUTES
// ==========================================

// Create New Course
app.post('/api/courses', async (req, res) => {
  try {
    const { courseCode, courseName, credits, department, courseType, maxCapacity, description, prerequisites } = req.body;
    
    if (!courseCode || !courseName || !credits || !department) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    // Check if course already exists
    const existing = await db.collection('courses').findOne({ courseCode });
    if (existing) {
      return res.status(400).json({ error: "Course already exists" });
    }
    
    const course = {
      courseCode,
      courseName,
      credits: parseInt(credits),
      department,
      courseType: courseType || 'Theory',
      maxCapacity: parseInt(maxCapacity) || 120,
      description: description || '',
      prerequisites: prerequisites || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('courses').insertOne(course);
    
    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course
    });
    
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get All Courses
app.get('/api/courses', async (req, res) => {
  try {
    const department = req.query.department;
    const query = department ? { department } : {};
    
    const courses = await db.collection('courses').find(query).toArray();
    
    res.json({ success: true, courses });
    
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get Course by Code
app.get('/api/courses/:code', async (req, res) => {
  try {
    const course = await db.collection('courses').findOne({ courseCode: req.params.code });
    
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    
    res.json({ success: true, course });
    
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ==========================================
// COURSE OFFERING ROUTES
// ==========================================

// Create Course Offering
app.post('/api/offerings', async (req, res) => {
  try {
    const { courseCode, facultyId, semester, academicYear, slot, venue } = req.body;
    
    if (!courseCode || !facultyId || !semester || !academicYear || !slot) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    // Get course details
    const course = await db.collection('courses').findOne({ courseCode });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    
    // Get faculty details
    const faculty = await db.collection('faculty').findOne({ facultyId });
    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }
    
    const offering = {
      offeringId: generateId('O'),
      courseCode,
      facultyId,
      facultyName: faculty.name,
      semester,
      academicYear,
      slot,
      venue: venue || 'TBA',
      maxCapacity: course.maxCapacity,
      availableSeats: course.maxCapacity,
      enrolledCount: 0,
      credits: course.credits,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('courseOfferings').insertOne(offering);
    
    res.status(201).json({
      success: true,
      message: "Course offering created successfully",
      offering
    });
    
  } catch (error) {
    console.error("Error creating offering:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get Available Offerings (for registration)
app.get('/api/offerings/available', async (req, res) => {
  try {
    const semester = req.query.semester || 'Fall';
    const academicYear = req.query.academicYear || '2024-25';
    const department = req.query.department;
    
    const query = {
      semester,
      academicYear,
      availableSeats: { $gt: 0 }
    };
    
    if (department) {
      const courses = await db.collection('courses')
        .find({ department })
        .project({ courseCode: 1 })
        .toArray();
      
      const courseCodes = courses.map(c => c.courseCode);
      query.courseCode = { $in: courseCodes };
    }
    
    const offerings = await db.collection('courseOfferings')
      .aggregate([
        { $match: query },
        {
          $lookup: {
            from: 'courses',
            localField: 'courseCode',
            foreignField: 'courseCode',
            as: 'courseDetails'
          }
        },
        { $unwind: '$courseDetails' }
      ])
      .toArray();
    
    res.json({ success: true, offerings });
    
  } catch (error) {
    console.error("Error fetching offerings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ==========================================
// ENROLLMENT ROUTES
// ==========================================

// Enroll Student in Course
app.post('/api/enrollments/enroll', async (req, res) => {
  try {
    const { studentId, offeringId } = req.body;
    
    if (!studentId || !offeringId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    // Check if student exists
    const student = await db.collection('students').findOne({ studentId });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    
    // Check if offering exists and has seats
    const offering = await db.collection('courseOfferings').findOne({ offeringId });
    if (!offering) {
      return res.status(404).json({ error: "Course offering not found" });
    }
    
    if (offering.availableSeats <= 0) {
      return res.status(400).json({ error: "No seats available. Course is full." });
    }
    
    // Check if already enrolled
    const existingEnrollment = await db.collection('enrollments').findOne({
      studentId,
      offeringId
    });
    
    if (existingEnrollment) {
      return res.status(400).json({ error: "Already enrolled in this course" });
    }
    
    // Check for time slot conflicts
    const studentEnrollments = await db.collection('enrollments').find({
      studentId,
      semester: offering.semester,
      academicYear: offering.academicYear,
      status: 'Enrolled'
    }).toArray();
    
    for (let enrollment of studentEnrollments) {
      const enrolledOffering = await db.collection('courseOfferings').findOne({
        offeringId: enrollment.offeringId
      });
      
      if (enrolledOffering && enrolledOffering.slot === offering.slot) {
        return res.status(400).json({
          error: `Time slot conflict with ${enrolledOffering.courseCode}`
        });
      }
    }
    
    // Create enrollment
    const enrollment = {
      enrollmentId: generateId('E'),
      studentId,
      offeringId,
      courseCode: offering.courseCode,
      studentName: student.name,
      facultyName: offering.facultyName,
      enrollmentDate: new Date(),
      semester: offering.semester,
      academicYear: offering.academicYear,
      status: 'Enrolled',
      attendance: 0,
      internalMarks: null,
      finalMarks: null,
      grade: null,
      credits: offering.credits,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Insert enrollment and update seat count
    await db.collection('enrollments').insertOne(enrollment);
    await db.collection('courseOfferings').updateOne(
      { offeringId },
      {
        $inc: { availableSeats: -1, enrolledCount: 1 },
        $set: { updatedAt: new Date() }
      }
    );
    
    res.status(201).json({
      success: true,
      message: "Enrollment successful",
      enrollment
    });
    
  } catch (error) {
    console.error("Error enrolling student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Drop Course
app.post('/api/enrollments/:enrollmentId/drop', async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    
    const enrollment = await db.collection('enrollments').findOne({ enrollmentId });
    
    if (!enrollment) {
      return res.status(404).json({ error: "Enrollment not found" });
    }
    
    if (enrollment.status !== 'Enrolled') {
      return res.status(400).json({ error: "Cannot drop this course" });
    }
    
    // Update enrollment status
    await db.collection('enrollments').updateOne(
      { enrollmentId },
      {
        $set: {
          status: 'Dropped',
          updatedAt: new Date()
        }
      }
    );
    
    // Update seat availability
    await db.collection('courseOfferings').updateOne(
      { offeringId: enrollment.offeringId },
      {
        $inc: { availableSeats: 1, enrolledCount: -1 },
        $set: { updatedAt: new Date() }
      }
    );
    
    res.json({
      success: true,
      message: "Course dropped successfully"
    });
    
  } catch (error) {
    console.error("Error dropping course:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get Student Enrollments
app.get('/api/students/:studentId/enrollments', async (req, res) => {
  try {
    const { studentId } = req.params;
    const semester = req.query.semester;
    const academicYear = req.query.academicYear;
    
    const query = { studentId };
    if (semester) query.semester = semester;
    if (academicYear) query.academicYear = academicYear;
    
    const enrollments = await db.collection('enrollments')
      .aggregate([
        { $match: query },
        {
          $lookup: {
            from: 'courseOfferings',
            localField: 'offeringId',
            foreignField: 'offeringId',
            as: 'offeringDetails'
          }
        },
        {
          $lookup: {
            from: 'courses',
            localField: 'courseCode',
            foreignField: 'courseCode',
            as: 'courseDetails'
          }
        },
        { $unwind: { path: '$offeringDetails', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$courseDetails', preserveNullAndEmptyArrays: true } }
      ])
      .toArray();
    
    // Calculate CGPA
    const cgpa = calculateCGPA(enrollments);
    
    res.json({
      success: true,
      enrollments,
      cgpa: parseFloat(cgpa)
    });
    
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get Course Enrollments (for faculty)
app.get('/api/courses/:courseCode/students', async (req, res) => {
  try {
    const { courseCode } = req.params;
    const offeringId = req.query.offeringId;
    
    const query = { courseCode, status: 'Enrolled' };
    if (offeringId) query.offeringId = offeringId;
    
    const enrollments = await db.collection('enrollments')
      .aggregate([
        { $match: query },
        {
          $lookup: {
            from: 'students',
            localField: 'studentId',
            foreignField: 'studentId',
            as: 'studentDetails'
          }
        },
        { $unwind: '$studentDetails' },
        {
          $project: {
            'studentDetails.password': 0
          }
        }
      ])
      .toArray();
    
    res.json({
      success: true,
      count: enrollments.length,
      enrollments
    });
    
  } catch (error) {
    console.error("Error fetching course students:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update Grade
app.put('/api/enrollments/:enrollmentId/grade', async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { internalMarks, finalMarks } = req.body;
    
    const enrollment = await db.collection('enrollments').findOne({ enrollmentId });
    
    if (!enrollment) {
      return res.status(404).json({ error: "Enrollment not found" });
    }
    
    const internal = internalMarks !== undefined ? parseInt(internalMarks) : enrollment.internalMarks || 0;
    const final = finalMarks !== undefined ? parseInt(finalMarks) : enrollment.finalMarks || 0;
    const totalMarks = internal + final;
    const grade = calculateGrade(totalMarks);
    
    await db.collection('enrollments').updateOne(
      { enrollmentId },
      {
        $set: {
          internalMarks: internal,
          finalMarks: final,
          grade,
          status: 'Completed',
          updatedAt: new Date()
        }
      }
    );
    
    // Update student CGPA
    const allEnrollments = await db.collection('enrollments')
      .find({ studentId: enrollment.studentId })
      .toArray();
    
    const cgpa = calculateCGPA(allEnrollments);
    
    await db.collection('students').updateOne(
      { studentId: enrollment.studentId },
      { $set: { cgpa: parseFloat(cgpa), updatedAt: new Date() } }
    );
    
    res.json({
      success: true,
      message: "Grade updated successfully",
      grade,
      totalMarks,
      cgpa: parseFloat(cgpa)
    });
    
  } catch (error) {
    console.error("Error updating grade:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ==========================================
// FACULTY ROUTES
// ==========================================

// Create Faculty
app.post('/api/faculty', async (req, res) => {
  try {
    const { name, email, department, designation, phone } = req.body;
    
    if (!name || !email || !department) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const existing = await db.collection('faculty').findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Faculty with this email already exists" });
    }
    
    const faculty = {
      facultyId: generateId('F'),
      name,
      email,
      department,
      designation: designation || 'Assistant Professor',
      phone: phone || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('faculty').insertOne(faculty);
    
    res.status(201).json({
      success: true,
      message: "Faculty created successfully",
      faculty
    });
    
  } catch (error) {
    console.error("Error creating faculty:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get All Faculty
app.get('/api/faculty', async (req, res) => {
  try {
    const department = req.query.department;
    const query = department ? { department } : {};
    
    const faculty = await db.collection('faculty').find(query).toArray();
    
    res.json({ success: true, faculty });
    
  } catch (error) {
    console.error("Error fetching faculty:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ==========================================
// STATISTICS & REPORTS
// ==========================================

// Get Dashboard Statistics
app.get('/api/stats/dashboard', async (req, res) => {
  try {
    const totalStudents = await db.collection('students').countDocuments();
    const totalCourses = await db.collection('courses').countDocuments();
    const totalEnrollments = await db.collection('enrollments').countDocuments({ status: 'Enrolled' });
    const totalFaculty = await db.collection('faculty').countDocuments();
    
    // Branch-wise student count
    const branchStats = await db.collection('students').aggregate([
      { $group: { _id: '$branch', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();
    
    // Course-wise enrollment count
    const courseStats = await db.collection('enrollments').aggregate([
      { $match: { status: 'Enrolled' } },
      { $group: { _id: '$courseCode', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).toArray();
    
    res.json({
      success: true,
      stats: {
        totalStudents,
        totalCourses,
        totalEnrollments,
        totalFaculty,
        branchStats,
        courseStats
      }
    });
    
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ==========================================
// ERROR HANDLING & SERVER STARTUP
// ==========================================

app.get('/', (req, res) => {
  res.send(`
    <h2>✅ VIT Course Registration System Backend</h2>
    <p>Server is running on port ${PORT}</p>
    <p>Try <a href="/api/students">/api/students</a> or <a href="/api/courses">/api/courses</a></p>
  `);
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start Server
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 VIT Course Registration System API`);
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log(`📊 MongoDB Atlas connected`);
    console.log(`\n📚 Available endpoints:`);
    console.log(`   POST   /api/students/register`);
    console.log(`   GET    /api/students/:id`);
    console.log(`   GET    /api/students/:id/enrollments`);
    console.log(`   POST   /api/courses`);
    console.log(`   GET    /api/courses`);
    console.log(`   POST   /api/offerings`);
    console.log(`   GET    /api/offerings/available`);
    console.log(`   POST   /api/enrollments/enroll`);
    console.log(`   POST   /api/enrollments/:id/drop`);
    console.log(`   PUT    /api/enrollments/:id/grade`);
    console.log(`   GET    /api/courses/:code/students`);
    console.log(`   POST   /api/faculty`);
    console.log(`   GET    /api/stats/dashboard\n`);
  });
});

// Graceful Shutdown
process.on('SIGINT', async () => {
  console.log('\n⚠️  Shutting down gracefully...');
  await client.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
});