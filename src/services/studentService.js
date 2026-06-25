// Student business logic
const bcrypt = require('bcryptjs');
const database = require('../config/database');
const { generateId, sanitizeUser, getPaginationParams, buildPaginationResponse } = require('../utils/helpers');
const { AppError } = require('../middleware/errorHandler');

class StudentService {
  async createStudent(data) {
    const db = database.getDb();

    // Check if student exists
    const existing = await db.collection('students').findOne({
      $or: [
        { registrationNumber: data.registrationNumber },
        { email: data.email }
      ]
    });

    if (existing) {
      throw new AppError('Student with this registration number or email already exists', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create student document
    const student = {
      studentId: generateId('S'),
      registrationNumber: data.registrationNumber,
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phone: data.phone || null,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      branch: data.branch,
      semester: parseInt(data.semester) || 1,
      cgpa: 0,
      type: data.type || 'undergraduate',
      hostelBlock: data.hostelBlock || null,
      researchArea: data.researchArea || null,
      guideId: data.guideId || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('students').insertOne(student);

    return {
      ...sanitizeUser(student),
      _id: result.insertedId
    };
  }

  async getStudentById(studentId) {
    const db = database.getDb();
    const student = await db.collection('students').findOne(
      { studentId },
      { projection: { password: 0 } }
    );

    if (!student) {
      throw new AppError('Student not found', 404);
    }

    return student;
  }

  async updateStudent(studentId, data) {
    const db = database.getDb();

    const updateData = {
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
      ...(data.phone && { phone: data.phone }),
      ...(data.hostelBlock && { hostelBlock: data.hostelBlock }),
      ...(data.semester && { semester: parseInt(data.semester) }),
      updatedAt: new Date()
    };

    const result = await db.collection('students').updateOne(
      { studentId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      throw new AppError('Student not found', 404);
    }

    return { message: 'Student updated successfully' };
  }

  async getAllStudents(query) {
    const db = database.getDb();
    const { page, limit, skip } = getPaginationParams(query);

    const filter = {};
    if (query.branch) filter.branch = query.branch;
    if (query.semester) filter.semester = parseInt(query.semester);
    if (query.type) filter.type = query.type;

    const [students, total] = await Promise.all([
      db.collection('students')
        .find(filter, { projection: { password: 0 } })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection('students').countDocuments(filter)
    ]);

    return {
      students,
      pagination: buildPaginationResponse(page, limit, total)
    };
  }

  async deleteStudent(studentId) {
    const db = database.getDb();
    const result = await db.collection('students').deleteOne({ studentId });

    if (result.deletedCount === 0) {
      throw new AppError('Student not found', 404);
    }

    return { message: 'Student deleted successfully' };
  }

  async updateCGPA(studentId, cgpa) {
    const db = database.getDb();
    await db.collection('students').updateOne(
      { studentId },
      { $set: { cgpa: parseFloat(cgpa), updatedAt: new Date() } }
    );
  }
}

module.exports = new StudentService();
