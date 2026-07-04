const express = require('express');
const passport = require('passport');
const AuthController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

function createAuthRoutes(db) {
  const router = express.Router();
  const authController = new AuthController(db);

  // Email/Password auth
  router.post('/register', authController.register);
  router.post('/login', authController.login);
  router.post('/refresh', authController.refreshToken);
  router.post('/logout', protect, authController.logout);

  // Protected routes
  router.get('/me', protect, authController.getProfile);
  router.put('/me', protect, authController.updateProfile);

  // Google OAuth routes
  router.get(
    '/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })
  );

  router.get(
    '/google/callback',
    passport.authenticate('google', {
      failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=google_auth_failed`,
      session: false,
    }),
    authController.googleCallback
  );

  return router;
}

module.exports = createAuthRoutes;
