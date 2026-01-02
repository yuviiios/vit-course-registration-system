// seedData.js
// Run this script to populate your MongoDB Atlas database with sample data
// Usage: node seedData.js

const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || "mongodb+srv://username:password@cluster.mongodb.net/";
const client = new MongoClient(uri);

// Sample Data for VIT Course Registration System
const sampleData = {
  students: [
    {
      studentId: "S001",
      registrationNumber: "21BCE0001",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@vitstudent.ac.in",
      phone: "+91-9876543210",
      dateOfBirth: new Date("2003-05-15"),
      branch: "CSE",
      semester: 5,
      cgpa: 8.9,
      type: "undergraduate",
      hostelBlock: "A-Block",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      studentId: "S002",
      registrationNumber: "21BMECH0045",
      name: "Priya Patel",
      email: "priya.patel@vitstudent.ac.in",
      phone: "+91-9876543211",
      dateOfBirth: new Date("2003-08-22"),
      branch: "MECH",
      semester: 5,
      cgpa: 8.2,
      type: "undergraduate",
      hostelBlock: "B-Block",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      studentId: "S003",
      registrationNumber: "21BECE0123",
      name: "Amit Singh",
      email: "amit.singh@vitstudent.ac.in",
      phone: "+91-9876543212",
      dateOfBirth: new Date("2002-11-10"),
      branch: "ECE",
      semester: 7,
      cgpa: 9.1,
      type: "undergraduate",
      hostelBlock: "C-Block",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      studentId: "S004",
      registrationNumber: "21BCIVIL0067",
      name: "Sneha Reddy",
      email: "sneha.reddy@vitstudent.ac.in",
      phone: "+91-9876543213",
      dateOfBirth: new Date("2003-02-18"),
      branch: "CIVIL",
      semester: 5,
      cgpa: 7.8,
      type: "undergraduate",
      hostelBlock: "D-Block",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      studentId: "S005",
      registrationNumber: "21BCE0234",
      name: "Vikram Desai",
      email: "vikram.desai@vitstudent.ac.in",
      phone: "+91-9876543214",
      dateOfBirth: new Date("2002-07-30"),
      branch: "CSE",
      semester: 7,
      cgpa: 8.7,
      type: "undergraduate",
      hostelBlock: "A-Block",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      studentId: "S006",
      registrationNumber: "21BMECH0156",
      name: "Kavya Menon",
      email: "kavya.menon@vitstudent.ac.in",
      phone: "+91-9876543215",
      dateOfBirth: new Date("2003-04-12"),
      branch: "MECH",
      semester: 5,
      cgpa: 7.5,
      type: "undergraduate",
      hostelBlock: "B-Block",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      studentId: "S007",
      registrationNumber: "21BECE0089",
      name: "Arjun Nair",
      email: "arjun.nair@vitstudent.ac.in",
      phone: "+91-9876543216",
      dateOfBirth: new Date("2002-09-25"),
      branch: "ECE",
      semester: 7,
      cgpa: 9.3,
      type: "undergraduate",
      hostelBlock: "C-Block",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      studentId: "S008",
      registrationNumber: "21BCE0445",
      name: "Deepika Joshi",
      email: "deepika.joshi@vitstudent.ac.in",
      phone: "+91-9876543217",
      dateOfBirth: new Date("2003-01-08"),
      branch: "CSE",
      semester: 5,
      cgpa: 8.1,
      type: "undergraduate",
      hostelBlock: "D-Block",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      studentId: "S009",
      registrationNumber: "21BCIVIL0123",
      name: "Rohit Sharma",
      email: "rohit.sharma@vitstudent.ac.in",
      phone: "+91-9876543218",
      dateOfBirth: new Date("2002-12-03"),
      branch: "CIVIL",
      semester: 7,
      cgpa: 8.4,
      type: "undergraduate",
      hostelBlock: "A-Block",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      studentId: "S010",
      registrationNumber: "21BMECH0234",
      name: "Ananya Krishnan",
      email: "ananya.krishnan@vitstudent.ac.in",
      phone: "+91-9876543219",
      dateOfBirth: new Date("2003-06-19"),
      branch: "MECH",
      semester: 5,
      cgpa: 7.9,
      type: "undergraduate",
      hostelBlock: "B-Block",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  
  faculty: [
    {
      facultyId: "F001",
      name: "Dr. Priya Sharma",
      email: "priya.sharma@vit.ac.in",
      department: "CSE",
      designation: "Associate Professor",
      phone: "+91-9123456780",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      facultyId: "F002",
      name: "Dr. Arun Verma",
      email: "arun.verma@vit.ac.in",
      department: "MECH",
      designation: "Professor",
      phone: "+91-9123456781",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      facultyId: "F003",
      name: "Dr. Meera Iyer",
      email: "meera.iyer@vit.ac.in",
      department: "ECE",
      designation: "Assistant Professor",
      phone: "+91-9123456782",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      facultyId: "F004",
      name: "Dr. Karthik Rao",
      email: "karthik.rao@vit.ac.in",
      department: "CIVIL",
      designation: "Associate Professor",
      phone: "+91-9123456783",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      facultyId: "F005",
      name: "Dr. Anjali Nair",
      email: "anjali.nair@vit.ac.in",
      department: "CSE",
      designation: "Professor",
      phone: "+91-9123456784",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  
  courses: [
    {
      courseCode: "CSE2001",
      courseName: "Database Management Systems",
      credits: 4,
      department: "CSE",
      courseType: "Theory",
      maxCapacity: 120,
      description: "Comprehensive course on DBMS concepts, SQL, normalization, and transactions",
      prerequisites: ["CSE1001"],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      courseCode: "CSE3010",
      courseName: "Machine Learning",
      credits: 4,
      department: "CSE",
      courseType: "Theory",
      maxCapacity: 100,
      description: "Introduction to ML algorithms, neural networks, and deep learning",
      prerequisites: ["CSE2001", "MAT2001"],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      courseCode: "MECH1002",
      courseName: "Engineering Mechanics",
      credits: 3,
      department: "MECH",
      courseType: "Theory",
      maxCapacity: 100,
      description: "Statics and dynamics of rigid bodies",
      prerequisites: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      courseCode: "MECH2015",
      courseName: "Thermodynamics",
      credits: 3,
      department: "MECH",
      courseType: "Theory",
      maxCapacity: 90,
      description: "Laws of thermodynamics and their applications",
      prerequisites: ["MECH1002"],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      courseCode: "ECE3015",
      courseName: "Digital Signal Processing",
      credits: 4,
      department: "ECE",
      courseType: "Theory",
      maxCapacity: 80,
      description: "Signal processing techniques and applications",
      prerequisites: ["ECE2001"],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      courseCode: "ECE2008",
      courseName: "Analog Electronics",
      credits: 4,
      department: "ECE",
      courseType: "Theory",
      maxCapacity: 95,
      description: "Analog circuit design and analysis",
      prerequisites: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      courseCode: "CIVIL2020",
      courseName: "Structural Analysis",
      credits: 3,
      department: "CIVIL",
      courseType: "Theory",
      maxCapacity: 90,
      description: "Analysis of structures using various methods",
      prerequisites: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      courseCode: "CIVIL3005",
      courseName: "Concrete Technology",
      credits: 4,
      department: "CIVIL",
      courseType: "Theory",
      maxCapacity: 85,
      description: "Properties and design of concrete structures",
      prerequisites: ["CIVIL2020"],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      courseCode: "CSE1001",
      courseName: "Programming in C",
      credits: 3,
      department: "CSE",
      courseType: "Theory",
      maxCapacity: 150,
      description: "Introduction to programming using C language",
      prerequisites: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      courseCode: "MECH3020",
      courseName: "Heat Transfer",
      credits: 3,
      department: "MECH",
      courseType: "Theory",
      maxCapacity: 80,
      description: "Modes of heat transfer and their applications",
      prerequisites: ["MECH2015"],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  
  courseOfferings: [
    {
      offeringId: "O101",
      courseCode: "CSE2001",
      facultyId: "F001",
      facultyName: "Dr. Priya Sharma",
      semester: "Fall",
      academicYear: "2024-25",
      slot: "A1+TA1",
      venue: "SJT-203",
      maxCapacity: 120,
      availableSeats: 45,
      enrolledCount: 75,
      credits: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      offeringId: "O102",
      courseCode: "MECH1002",
      facultyId: "F002",
      facultyName: "Dr. Arun Verma",
      semester: "Fall",
      academicYear: "2024-25",
      slot: "B1+TB1",
      venue: "MB-104",
      maxCapacity: 100,
      availableSeats: 22,
      enrolledCount: 78,
      credits: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      offeringId: "O103",
      courseCode: "ECE3015",
      facultyId: "F003",
      facultyName: "Dr. Meera Iyer",
      semester: "Fall",
      academicYear: "2024-25",
      slot: "C1+TC1",
      venue: "SMVG-301",
      maxCapacity: 80,
      availableSeats: 8,
      enrolledCount: 72,
      credits: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      offeringId: "O104",
      courseCode: "CIVIL2020",
      facultyId: "F004",
      facultyName: "Dr. Karthik Rao",
      semester: "Fall",
      academicYear: "2024-25",
      slot: "D1+TD1",
      venue: "GDN-113",
      maxCapacity: 90,
      availableSeats: 18,
      enrolledCount: 72,
      credits: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      offeringId: "O105",
      courseCode: "CSE3010",
      facultyId: "F005",
      facultyName: "Dr. Anjali Nair",
      semester: "Fall",
      academicYear: "2024-25",
      slot: "E1+TE1",
      venue: "SJT-401",
      maxCapacity: 100,
      availableSeats: 10,
      enrolledCount: 90,
      credits: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      offeringId: "O106",
      courseCode: "MECH2015",
      facultyId: "F002",
      facultyName: "Dr. Arun Verma",
      semester: "Fall",
      academicYear: "2024-25",
      slot: "F1+TF1",
      venue: "MB-205",
      maxCapacity: 90,
      availableSeats: 15,
      enrolledCount: 75,
      credits: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      offeringId: "O107",
      courseCode: "ECE2008",
      facultyId: "F003",
      facultyName: "Dr. Meera Iyer",
      semester: "Fall",
      academicYear: "2024-25",
      slot: "G1+TG1",
      venue: "SMVG-201",
      maxCapacity: 95,
      availableSeats: 1,
      enrolledCount: 94,
      credits: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      offeringId: "O108",
      courseCode: "CSE1001",
      facultyId: "F001",
      facultyName: "Dr. Priya Sharma",
      semester: "Fall",
      academicYear: "2024-25",
      slot: "A2+TA2",
      venue: "SJT-101",
      maxCapacity: 150,
      availableSeats: 82,
      enrolledCount: 68,
      credits: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      offeringId: "O109",
      courseCode: "CIVIL3005",
      facultyId: "F004",
      facultyName: "Dr. Karthik Rao",
      semester: "Fall",
      academicYear: "2024-25",
      slot: "B2+TB2",
      venue: "GDN-215",
      maxCapacity: 85,
      availableSeats: 11,
      enrolledCount: 74,
      credits: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      offeringId: "O110",
      courseCode: "MECH3020",
      facultyId: "F002",
      facultyName: "Dr. Arun Verma",
      semester: "Fall",
      academicYear: "2024-25",
      slot: "C2+TC2",
      venue: "MB-310",
      maxCapacity: 80,
      availableSeats: 6,
      enrolledCount: 74,
      credits: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  
  enrollments: [
    {
      enrollmentId: "E001",
      studentId: "S001",
      offeringId: "O101",
      courseCode: "CSE2001",
      studentName: "Rajesh Kumar",
      facultyName: "Dr. Priya Sharma",
      enrollmentDate: new Date("2024-07-15"),
      semester: "Fall",
      academicYear: "2024-25",
      status: "Completed",
      attendance: 92,
      internalMarks: 38,
      finalMarks: 47,
      grade: "A",
      credits: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      enrollmentId: "E002",
      studentId: "S002",
      offeringId: "O102",
      courseCode: "MECH1002",
      studentName: "Priya Patel",
      facultyName: "Dr. Arun Verma",
      enrollmentDate: new Date("2024-07-16"),
      semester: "Fall",
      academicYear: "2024-25",
      status: "Completed",
      attendance: 88,
      internalMarks: 35,
      finalMarks: 43,
      grade: "B+",
      credits: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      enrollmentId: "E003",
      studentId: "S003",
      offeringId: "O103",
      courseCode: "ECE3015",
      studentName: "Amit Singh",
      facultyName: "Dr. Meera Iyer",
      enrollmentDate: new Date("2024-07-17"),
      semester: "Fall",
      academicYear: "2024-25",
      status: "Completed",
      attendance: 95,
      internalMarks: 40,
      finalMarks: 52,
      grade: "A+",
      credits: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      enrollmentId: "E004",
      studentId: "S004",
      offeringId: "O104",
      courseCode: "CIVIL2020",
      studentName: "Sneha Reddy",
      facultyName: "Dr. Karthik Rao",
      enrollmentDate: new Date("2024-07-18"),
      semester: "Fall",
      academicYear: "2024-25",
      status: "Completed",
      attendance: 82,
      internalMarks: 32,
      finalMarks: 40,
      grade: "B",
      credits: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      enrollmentId: "E005",
      studentId: "S005",
      offeringId: "O105",
      courseCode: "CSE3010",
      studentName: "Vikram Desai",
      facultyName: "Dr. Anjali Nair",
      enrollmentDate: new Date("2024-07-19"),
      semester: "Fall",
      academicYear: "2024-25",
      status: "Enrolled",
      attendance: 90,
      internalMarks: 36,
      finalMarks: null,
      grade: null,
      credits: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      enrollmentId: "E006",
      studentId: "S006",
      offeringId: "O106",
      courseCode: "MECH2015",
      studentName: "Kavya Menon",
      facultyName: "Dr. Arun Verma",
      enrollmentDate: new Date("2024-07-20"),
      semester: "Fall",
      academicYear: "2024-25",
      status: "Completed",
      attendance: 75,
      internalMarks: 28,
      finalMarks: 37,
      grade: "C+",
      credits: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      enrollmentId: "E007",
      studentId: "S007",
      offeringId: "O107",
      courseCode: "ECE2008",
      studentName: "Arjun Nair",
      facultyName: "Dr. Meera Iyer",
      enrollmentDate: new Date("2024-07-21"),
      semester: "Fall",
      academicYear: "2024-25",
      status: "Completed",
      attendance: 96,
      internalMarks: 39,
      finalMarks: 55,
      grade: "A+",
      credits: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      enrollmentId: "E008",
      studentId: "S008",
      offeringId: "O108",
      courseCode: "CSE1001",
      studentName: "Deepika Joshi",
      facultyName: "Dr. Priya Sharma",
      enrollmentDate: new Date("2024-07-22"),
      semester: "Fall",
      academicYear: "2024-25",
      status: "Dropped",
      attendance: 65,
      internalMarks: 25,
      finalMarks: null,
      grade: null,
      credits: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      enrollmentId: "E009",
      studentId: "S009",
      offeringId: "O109",
      courseCode: "CIVIL3005",
      studentName: "Rohit Sharma",
      facultyName: "Dr. Karthik Rao",
      enrollmentDate: new Date("2024-07-23"),
      semester: "Fall",
      academicYear: "2024-25",
      status: "Enrolled",
      attendance: 89,
      internalMarks: 37,
      finalMarks: null,
      grade: null,
      credits: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      enrollmentId: "E010",
      studentId: "S010",
      offeringId: "O110",
      courseCode: "MECH3020",
      studentName: "Ananya Krishnan",
      facultyName: "Dr. Arun Verma",
      enrollmentDate: new Date("2024-07-24"),
      semester: "Fall",
      academicYear: "2024-25",
      status: "Completed",
      attendance: 84,
      internalMarks: 33,
      finalMarks: 41,
      grade: "B",
      credits: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
};

// Main seeding function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');
    
    await client.connect();
    const db = client.db("vit_course_registration");
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await db.collection('students').deleteMany({});
    await db.collection('faculty').deleteMany({});
    await db.collection('courses').deleteMany({});
    await db.collection('courseOfferings').deleteMany({});
    await db.collection('enrollments').deleteMany({});
    console.log('✅ Existing data cleared\n');
    
    // Insert students
    console.log('👨‍🎓 Inserting students...');
    await db.collection('students').insertMany(sampleData.students);
    console.log(`✅ Inserted ${sampleData.students.length} students\n`);
    
    // Insert faculty
    console.log('👨‍🏫 Inserting faculty...');
    await db.collection('faculty').insertMany(sampleData.faculty);
    console.log(`✅ Inserted ${sampleData.faculty.length} faculty members\n`);
    
    // Insert courses
    console.log('📚 Inserting courses...');
    await db.collection('courses').insertMany(sampleData.courses);
    console.log(`✅ Inserted ${sampleData.courses.length} courses\n`);
    
    // Insert course offerings
    console.log('📅 Inserting course offerings...');
    await db.collection('courseOfferings').insertMany(sampleData.courseOfferings);
    console.log(`✅ Inserted ${sampleData.courseOfferings.length} course offerings\n`);
    
    // Insert enrollments
    console.log('📝 Inserting enrollments...');
    await db.collection('enrollments').insertMany(sampleData.enrollments);
    console.log(`✅ Inserted ${sampleData.enrollments.length} enrollments\n`);
    
    // Create indexes
    console.log('🔍 Creating indexes...');
    await db.collection('students').createIndex({ registrationNumber: 1 }, { unique: true });
    await db.collection('students').createIndex({ email: 1 }, { unique: true });
    await db.collection('students').createIndex({ branch: 1 });
    await db.collection('courses').createIndex({ courseCode: 1 }, { unique: true });
    await db.collection('courseOfferings').createIndex({ offeringId: 1 }, { unique: true });
    await db.collection('enrollments').createIndex({ studentId: 1, offeringId: 1 }, { unique: true });
    await db.collection('enrollments').createIndex({ studentId: 1 });
    await db.collection('enrollments').createIndex({ courseCode: 1 });
    console.log('✅ Indexes created\n');
    
    // Verify data
    console.log('🔢 Verifying data counts:');
    const counts = {
      students: await db.collection('students').countDocuments(),
      faculty: await db.collection('faculty').countDocuments(),
      courses: await db.collection('courses').countDocuments(),
      courseOfferings: await db.collection('courseOfferings').countDocuments(),
      enrollments: await db.collection('enrollments').countDocuments()
    };
    
    console.log(`   Students: ${counts.students}`);
    console.log(`   Faculty: ${counts.faculty}`);
    console.log(`   Courses: ${counts.courses}`);
    console.log(`   Course Offerings: ${counts.courseOfferings}`);
    console.log(`   Enrollments: ${counts.enrollments}\n`);
    
    console.log('✨ Database seeding completed successfully!\n');
    
    // Sample queries
    console.log('📊 Sample Data Preview:');
    console.log('\n--- Top 3 Students by CGPA ---');
    const topStudents = await db.collection('students')
      .find({}, { projection: { password: 0 } })
      .sort({ cgpa: -1 })
      .limit(3)
      .toArray();
    topStudents.forEach(s => {
      console.log(`${s.name} (${s.registrationNumber}) - CGPA: ${s.cgpa}`);
    });
    
    console.log('\n--- Courses with Available Seats ---');
    const availableCourses = await db.collection('courseOfferings')
      .find({ availableSeats: { $gt: 0 } })
      .sort({ availableSeats: -1 })
      .limit(5)
      .toArray();
    availableCourses.forEach(c => {
      console.log(`${c.courseCode} - ${c.availableSeats} seats available`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the seeding
seedDatabase();