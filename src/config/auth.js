const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Allowed college email domain
const ALLOWED_EMAIL_DOMAIN = '@vitstudent.ac.in';

// JWT config
const JWT_CONFIG = {
  accessTokenSecret: process.env.JWT_SECRET,
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
  accessTokenExpiry: process.env.JWT_EXPIRES_IN || '7d',
  refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
};

/**
 * Generate JWT access token
 */
function generateAccessToken(payload) {
  return jwt.sign(payload, JWT_CONFIG.accessTokenSecret, {
    expiresIn: JWT_CONFIG.accessTokenExpiry,
  });
}

/**
 * Generate JWT refresh token
 */
function generateRefreshToken(payload) {
  return jwt.sign(payload, JWT_CONFIG.refreshTokenSecret, {
    expiresIn: JWT_CONFIG.refreshTokenExpiry,
  });
}

/**
 * Verify JWT access token
 */
function verifyAccessToken(token) {
  return jwt.verify(token, JWT_CONFIG.accessTokenSecret);
}

/**
 * Verify JWT refresh token
 */
function verifyRefreshToken(token) {
  return jwt.verify(token, JWT_CONFIG.refreshTokenSecret);
}

/**
 * Check if email is from allowed college domain
 */
function isCollegeEmail(email) {
  return email && email.toLowerCase().endsWith(ALLOWED_EMAIL_DOMAIN);
}

/**
 * Configure Google OAuth strategy
 */
function configureGoogleAuth(studentsCollection) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;

          // Validate college email
          if (!email || !isCollegeEmail(email)) {
            return done(null, false, {
              message: 'Only VIT college emails (@vitstudent.ac.in) are allowed'
            });
          }

          // Check if student exists
          let student = await studentsCollection.findOne({ email });

          if (!student) {
            // Create new student from Google profile
            const newStudent = {
              studentId: `STU_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
              email,
              name: profile.displayName || email.split('@')[0],
              googleId: profile.id,
              profilePicture: profile.photos?.[0]?.value,
              authProvider: 'google',
              emailVerified: true,
              semester: 1, // Default
              branch: 'UNKNOWN', // Will be updated by student
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            const result = await studentsCollection.insertOne(newStudent);
            student = { ...newStudent, _id: result.insertedId };
          } else {
            // Update existing student with Google info
            await studentsCollection.updateOne(
              { email },
              {
                $set: {
                  googleId: profile.id,
                  profilePicture: profile.photos?.[0]?.value,
                  emailVerified: true,
                  authProvider: 'google',
                  updatedAt: new Date(),
                }
              }
            );
          }

          return done(null, student);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  // Serialize user for session
  passport.serializeUser((user, done) => {
    done(null, user.studentId);
  });

  // Deserialize user from session
  passport.deserializeUser(async (studentId, done) => {
    try {
      const student = await studentsCollection.findOne({ studentId });
      done(null, student);
    } catch (error) {
      done(error, null);
    }
  });
}

module.exports = {
  JWT_CONFIG,
  ALLOWED_EMAIL_DOMAIN,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  isCollegeEmail,
  configureGoogleAuth,
};
