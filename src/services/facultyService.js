// Faculty business logic
const database = require('../config/database');
const { generateId } = require('../utils/helpers');
const { AppError } = require('../middleware/errorHandler');

class FacultyService {
  async createFaculty(data) {
    const db = database.getDb();

    const existing = await db.collection('faculty').findOne({ email: data.email });
    if (existing) {
      throw new AppError('Faculty with this email already exists', 400);
    }

    const faculty = {
      facultyId: generateId('F'),
      name: data.name,
      email: data.email,
      department: data.department,
      designation: data.designation || 'Assistant Professor',
      phone: data.phone || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('faculty').insertOne(faculty);
    return faculty;
  }

  async getAllFaculty(query) {
    const db = database.getDb();

    const filter = {};
    if (query.department) filter.department = query.department;

    const faculty = await db.collection('faculty').find(filter).toArray();
    return faculty;
  }

  async getFacultyById(facultyId) {
    const db = database.getDb();
    const faculty = await db.collection('faculty').findOne({ facultyId });

    if (!faculty) {
      throw new AppError('Faculty not found', 404);
    }

    return faculty;
  }

  async updateFaculty(facultyId, data) {
    const db = database.getDb();

    const updateData = {
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
      ...(data.department && { department: data.department }),
      ...(data.designation && { designation: data.designation }),
      ...(data.phone && { phone: data.phone }),
      updatedAt: new Date()
    };

    const result = await db.collection('faculty').updateOne(
      { facultyId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      throw new AppError('Faculty not found', 404);
    }

    return { message: 'Faculty updated successfully' };
  }

  async deleteFaculty(facultyId) {
    const db = database.getDb();
    const result = await db.collection('faculty').deleteOne({ facultyId });

    if (result.deletedCount === 0) {
      throw new AppError('Faculty not found', 404);
    }

    return { message: 'Faculty deleted successfully' };
  }
}

module.exports = new FacultyService();
