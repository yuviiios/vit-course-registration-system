// Database configuration and connection
const { MongoClient } = require('mongodb');
require('dotenv').config();

class Database {
  constructor() {
    this.client = null;
    this.db = null;
  }

  async connect() {
    try {
      const uri = process.env.MONGODB_URI || "mongodb+srv://username:password@cluster.mongodb.net/";
      this.client = new MongoClient(uri);

      await this.client.connect();
      this.db = this.client.db("vit_course_registration");

      console.log("✅ Connected to MongoDB Atlas");
      await this.createIndexes();

      return this.db;
    } catch (error) {
      console.error("❌ MongoDB connection error:", error);
      throw error;
    }
  }

  async createIndexes() {
    await this.db.collection('students').createIndex({ registrationNumber: 1 }, { unique: true });
    await this.db.collection('students').createIndex({ email: 1 }, { unique: true });
    await this.db.collection('courses').createIndex({ courseCode: 1 }, { unique: true });
    await this.db.collection('enrollments').createIndex({ studentId: 1, offeringId: 1 }, { unique: true });
    await this.db.collection('courseOfferings').createIndex({ courseCode: 1, semester: 1, academicYear: 1 });
    console.log("✅ Database indexes created");
  }

  getDb() {
    if (!this.db) {
      throw new Error("Database not connected. Call connect() first.");
    }
    return this.db;
  }

  async close() {
    if (this.client) {
      await this.client.close();
      console.log("✅ MongoDB connection closed");
    }
  }
}

module.exports = new Database();
