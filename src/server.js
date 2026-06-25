// Server entry point
require('dotenv').config();
const app = require('./app');
const database = require('./config/database');

const PORT = process.env.PORT || 3000;

// Connect to database and start server
async function startServer() {
  try {
    await database.connect();

    app.listen(PORT, () => {
      console.log(`\n🚀 VIT Course Registration System API`);
      console.log(`📡 Server running on http://localhost:${PORT}`);
      console.log(`📊 MongoDB Atlas connected`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`\n✨ Ready to accept requests!\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⚠️  Shutting down gracefully...');
  await database.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⚠️  SIGTERM received, shutting down...');
  await database.close();
  process.exit(0);
});

// Unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

startServer();
