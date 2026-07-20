const express = require('express');
const passport = require('passport');
const rateLimit = require('express-rate-limit');
const AuthController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Too many attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

function createAuthRoutes(db) {
  const router = express.Router();
  const authController = new AuthController(db);

  // Email/Password auth
  router.post('/register', authLimiter, authController.register);
  router.post('/login', authLimiter, authController.login);
  router.post('/refresh', authController.refreshToken);
  router.post('/logout', protect, authController.logout);

  // Token exchange (for OAuth cookie flow)
  router.get('/exchange-token', authController.exchangeToken);

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
