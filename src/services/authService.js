const bcrypt = require('bcryptjs');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  isCollegeEmail,
} = require('../config/auth');

class AuthService {
  constructor(db) {
    this.db = db;
    this.studentsCollection = db.collection('students');
  }

  /**
   * Register new student with email/password
   */
  async register({ registrationNumber, name, email, password, branch, semester = 1 }) {
    // Validate college email
    if (!isCollegeEmail(email)) {
      throw new Error('Only VIT college emails (@vitstudent.ac.in) are allowed');
    }

    // Check if student already exists
    const existingStudent = await this.studentsCollection.findOne({
      $or: [{ email }, { registrationNumber }]
    });

    if (existingStudent) {
      if (existingStudent.email === email) {
        throw new Error('Email already registered');
      }
      if (existingStudent.registrationNumber === registrationNumber) {
        throw new Error('Registration number already exists');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create student document
    const studentId = `STU_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const newStudent = {
      studentId,
      registrationNumber,
      name,
      email,
      password: hashedPassword,
      branch,
      semester,
      authProvider: 'email',
      emailVerified: false,
      role: 'student',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await this.studentsCollection.insertOne(newStudent);

    // Remove password from response
    const { password: _, ...studentWithoutPassword } = newStudent;

    // Generate tokens
    const tokens = this.generateTokens(studentWithoutPassword);

    return {
      student: studentWithoutPassword,
      ...tokens,
    };
  }

  /**
   * Login with email/password
   */
  async login(email, password) {
    // Validate college email
    if (!isCollegeEmail(email)) {
      throw new Error('Only VIT college emails are allowed');
    }

    // Find student
    const student = await this.studentsCollection.findOne({ email });

    if (!student || !student.password) {
      throw new Error('Invalid email or password');
    }

    // Check if student used Google auth
    if (student.authProvider === 'google') {
      throw new Error('Please use Google Sign-In for this account');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, student.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Remove password from response
    const { password: _, ...studentWithoutPassword } = student;

    // Generate tokens
    const tokens = this.generateTokens(studentWithoutPassword);

    return {
      student: studentWithoutPassword,
      ...tokens,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken) {
    try {
      const decoded = verifyRefreshToken(refreshToken);

      // Verify student still exists
      const student = await this.studentsCollection.findOne({ studentId: decoded.studentId });

      if (!student) {
        throw new Error('Student not found');
      }

      // Remove password from response
      const { password: _, ...studentWithoutPassword } = student;

      // Generate new tokens
      const tokens = this.generateTokens(studentWithoutPassword);

      return tokens;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Refresh token expired. Please log in again.');
      }
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(studentId) {
    const student = await this.studentsCollection.findOne({ studentId });

    if (!student) {
      throw new Error('Student not found');
    }

    // Remove password from response
    const { password: _, ...studentWithoutPassword } = student;

    return studentWithoutPassword;
  }

  /**
   * Update student profile
   */
  async updateProfile(studentId, updates) {
    const allowedUpdates = ['name', 'phone', 'hostelBlock', 'branch', 'semester'];
    const filteredUpdates = {};

    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    }

    if (Object.keys(filteredUpdates).length === 0) {
      throw new Error('No valid fields to update');
    }

    filteredUpdates.updatedAt = new Date();

    const result = await this.studentsCollection.findOneAndUpdate(
      { studentId },
      { $set: filteredUpdates },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new Error('Student not found');
    }

    // Remove password from response
    const { password: _, ...studentWithoutPassword } = result;

    return studentWithoutPassword;
  }

  /**
   * Generate access and refresh tokens
   */
  generateTokens(student) {
    const payload = {
      studentId: student.studentId,
      email: student.email,
      role: student.role || 'student',
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    };
  }
}

module.exports = AuthService;
