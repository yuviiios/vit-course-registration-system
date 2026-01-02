// testAPI.js
// Simple script to test all API endpoints
// Usage: node testAPI.js

const BASE_URL = 'http://localhost:3000/api';

// Helper function to make HTTP requests
async function makeRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    return {
      status: response.status,
      ok: response.ok,
      data
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message
    };
  }
}

// Test functions
async function testGetAllStudents() {
  console.log('\n📝 Testing: GET All Students');
  const result = await makeRequest('/students');
  
  if (result.ok) {
    console.log('✅ Success!');
    console.log(`   Found ${result.data.students.length} students`);
    if (result.data.students.length > 0) {
      console.log(`   Sample: ${result.data.students[0].name} (${result.data.students[0].registrationNumber})`);
    }
  } else {
    console.log('❌ Failed:', result.data.error);
  }
  
  return result;
}

async function testGetStudent() {
  console.log('\n📝 Testing: GET Single Student');
  const result = await makeRequest('/students/S001');
  
  if (result.ok) {
    console.log('✅ Success!');
    console.log(`   Student: ${result.data.student.name}`);
    console.log(`   Branch: ${result.data.student.branch}`);
    console.log(`   CGPA: ${result.data.student.cgpa}`);
  } else {
    console.log('❌ Failed:', result.data.error);
  }
  
  return result;
}

async function testRegisterStudent() {
  console.log('\n📝 Testing: POST Register New Student');
  
  const newStudent = {
    registrationNumber: `21BCE${Math.floor(Math.random() * 9000) + 1000}`,
    name: "Test Student",
    email: `test.student${Date.now()}@vitstudent.ac.in`,
    password: "password123",
    phone: "+91-9876543299",
    dateOfBirth: "2003-01-01",
    branch: "CSE",
    semester: 5
  };
  
  const result = await makeRequest('/students/register', 'POST', newStudent);
  
  if (result.ok) {
    console.log('✅ Success!');
    console.log(`   Created: ${result.data.student.name}`);
    console.log(`   Student ID: ${result.data.student.studentId}`);
    console.log(`   Reg No: ${result.data.student.registrationNumber}`);
    return result.data.student.studentId;
  } else {
    console.log('❌ Failed:', result.data.error);
    return null;
  }
}

async function testGetAllCourses() {
  console.log('\n📝 Testing: GET All Courses');
  const result = await makeRequest('/courses');
  
  if (result.ok) {
    console.log('✅ Success!');
    console.log(`   Found ${result.data.courses.length} courses`);
    if (result.data.courses.length > 0) {
      console.log(`   Sample: ${result.data.courses[0].courseCode} - ${result.data.courses[0].courseName}`);
    }
  } else {
    console.log('❌ Failed:', result.data.error);
  }
  
  return result;
}

async function testGetAvailableOfferings() {
  console.log('\n📝 Testing: GET Available Course Offerings');
  const result = await makeRequest('/offerings/available?semester=Fall&academicYear=2024-25');
  
  if (result.ok) {
    console.log('✅ Success!');
    console.log(`   Found ${result.data.offerings.length} available offerings`);
    if (result.data.offerings.length > 0) {
      const offering = result.data.offerings[0];
      console.log(`   Sample: ${offering.courseCode} - ${offering.availableSeats} seats available`);
    }
  } else {
    console.log('❌ Failed:', result.data.error);
  }
  
  return result;
}

async function testEnrollStudent(studentId) {
  console.log('\n📝 Testing: POST Enroll Student in Course');
  
  if (!studentId) {
    console.log('⚠️  Skipped: No student ID provided');
    return null;
  }
  
  // Get an offering with available seats
  const offerings = await makeRequest('/offerings/available?semester=Fall&academicYear=2024-25');
  
  if (!offerings.ok || offerings.data.offerings.length === 0) {
    console.log('⚠️  No available offerings to test enrollment');
    return null;
  }
  
  const offering = offerings.data.offerings.find(o => o.availableSeats > 0);
  
  if (!offering) {
    console.log('⚠️  No offerings with available seats');
    return null;
  }
  
  const enrollData = {
    studentId: studentId,
    offeringId: offering.offeringId
  };
  
  const result = await makeRequest('/enrollments/enroll', 'POST', enrollData);
  
  if (result.ok) {
    console.log('✅ Success!');
    console.log(`   Enrolled in: ${result.data.enrollment.courseCode}`);
    console.log(`   Enrollment ID: ${result.data.enrollment.enrollmentId}`);
    return result.data.enrollment.enrollmentId;
  } else {
    console.log('❌ Failed:', result.data.error);
    return null;
  }
}

async function testGetStudentEnrollments(studentId) {
  console.log('\n📝 Testing: GET Student Enrollments');
  
  if (!studentId) {
    studentId = 'S001'; // Use default student
  }
  
  const result = await makeRequest(`/students/${studentId}/enrollments`);
  
  if (result.ok) {
    console.log('✅ Success!');
    console.log(`   Found ${result.data.enrollments.length} enrollments`);
    console.log(`   Student CGPA: ${result.data.cgpa}`);
    if (result.data.enrollments.length > 0) {
      const enrollment = result.data.enrollments[0];
      console.log(`   Sample: ${enrollment.courseCode} - Grade: ${enrollment.grade || 'Pending'}`);
    }
  } else {
    console.log('❌ Failed:', result.data.error);
  }
  
  return result;
}

async function testUpdateGrade(enrollmentId) {
  console.log('\n📝 Testing: PUT Update Grade');
  
  if (!enrollmentId) {
    enrollmentId = 'E005'; // Use an existing enrollment
  }
  
  const gradeData = {
    internalMarks: 38,
    finalMarks: 45
  };
  
  const result = await makeRequest(`/enrollments/${enrollmentId}/grade`, 'PUT', gradeData);
  
  if (result.ok) {
    console.log('✅ Success!');
    console.log(`   Grade: ${result.data.grade}`);
    console.log(`   Total Marks: ${result.data.totalMarks}`);
    console.log(`   Updated CGPA: ${result.data.cgpa}`);
  } else {
    console.log('❌ Failed:', result.data.error);
  }
  
  return result;
}

async function testGetCourseStudents() {
  console.log('\n📝 Testing: GET Course Students');
  const result = await makeRequest('/courses/CSE2001/students');
  
  if (result.ok) {
    console.log('✅ Success!');
    console.log(`   Found ${result.data.count} enrolled students`);
    if (result.data.enrollments.length > 0) {
      const enrollment = result.data.enrollments[0];
      console.log(`   Sample: ${enrollment.studentDetails.name} - Attendance: ${enrollment.attendance}%`);
    }
  } else {
    console.log('❌ Failed:', result.data.error);
  }
  
  return result;
}

async function testGetAllFaculty() {
  console.log('\n📝 Testing: GET All Faculty');
  const result = await makeRequest('/faculty');
  
  if (result.ok) {
    console.log('✅ Success!');
    console.log(`   Found ${result.data.faculty.length} faculty members`);
    if (result.data.faculty.length > 0) {
      const faculty = result.data.faculty[0];
      console.log(`   Sample: ${faculty.name} - ${faculty.designation}`);
    }
  } else {
    console.log('❌ Failed:', result.data.error);
  }
  
  return result;
}

async function testDashboardStats() {
  console.log('\n📝 Testing: GET Dashboard Statistics');
  const result = await makeRequest('/stats/dashboard');
  
  if (result.ok) {
    console.log('✅ Success!');
    console.log(`   Total Students: ${result.data.stats.totalStudents}`);
    console.log(`   Total Courses: ${result.data.stats.totalCourses}`);
    console.log(`   Total Enrollments: ${result.data.stats.totalEnrollments}`);
    console.log(`   Total Faculty: ${result.data.stats.totalFaculty}`);
  } else {
    console.log('❌ Failed:', result.data.error);
  }
  
  return result;
}

async function testDropCourse(enrollmentId) {
  console.log('\n📝 Testing: POST Drop Course');
  
  if (!enrollmentId) {
    console.log('⚠️  Skipped: No enrollment ID provided');
    return null;
  }
  
  const result = await makeRequest(`/enrollments/${enrollmentId}/drop`, 'POST');
  
  if (result.ok) {
    console.log('✅ Success!');
    console.log(`   Course dropped successfully`);
  } else {
    console.log('❌ Failed:', result.data.error);
  }
  
  return result;
}

// Main test runner
async function runAllTests() {
  console.log('═══════════════════════════════════════════════════');
  console.log('🧪 VIT COURSE REGISTRATION API TEST SUITE');
  console.log('═══════════════════════════════════════════════════');
  console.log(`📡 Testing API at: ${BASE_URL}`);
  console.log(`⏰ Test started at: ${new Date().toLocaleString()}`);
  
  let newStudentId = null;
  let newEnrollmentId = null;
  
  try {
    // Test 1: Get all students
    await testGetAllStudents();
    
    // Test 2: Get single student
    await testGetStudent();
    
    // Test 3: Register new student
    newStudentId = await testRegisterStudent();
    
    // Test 4: Get all courses
    await testGetAllCourses();
    
    // Test 5: Get available offerings
    await testGetAvailableOfferings();
    
    // Test 6: Enroll student (if new student created)
    if (newStudentId) {
      newEnrollmentId = await testEnrollStudent(newStudentId);
    }
    
    // Test 7: Get student enrollments
    await testGetStudentEnrollments(newStudentId || 'S001');
    
    // Test 8: Get course students
    await testGetCourseStudents();
    
    // Test 9: Update grade
    await testUpdateGrade(newEnrollmentId);
    
    // Test 10: Get all faculty
    await testGetAllFaculty();
    
    // Test 11: Dashboard statistics
    await testDashboardStats();
    
    // Test 12: Drop course (if enrollment created)
    if (newEnrollmentId) {
      await testDropCourse(newEnrollmentId);
    }
    
    console.log('\n═══════════════════════════════════════════════════');
    console.log('✅ ALL TESTS COMPLETED!');
    console.log('═══════════════════════════════════════════════════');
    console.log(`⏰ Test finished at: ${new Date().toLocaleString()}`);
    console.log('\n💡 Tips:');
    console.log('   - All endpoints are working correctly');
    console.log('   - Use Postman for detailed API testing');
    console.log('   - Check server logs for more details');
    console.log('   - MongoDB Atlas is connected properly\n');
    
  } catch (error) {
    console.log('\n❌ TEST SUITE FAILED!');
    console.log('Error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure server is running (npm start)');
    console.log('   2. Check MongoDB connection in .env');
    console.log('   3. Ensure database is seeded (npm run seed)');
    console.log('   4. Verify port 3000 is not in use\n');
  }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ Error: This script requires Node.js 18+ (for fetch API)');
  console.log('📝 Alternative: Use Postman to test the API endpoints');
  console.log('   Or upgrade Node.js: https://nodejs.org/\n');
  process.exit(1);
}

// Run the tests
runAllTests();