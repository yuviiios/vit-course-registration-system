const AuthService = require('../services/authService');
const { catchAsync, AppError } = require('../middleware/errorHandler');

class AuthController {
  constructor(db) {
    this.authService = new AuthService(db);
  }

  /**
   * Register new student
   * POST /api/auth/register
   */
  register = catchAsync(async (req, res) => {
    const { registrationNumber, name, email, password, branch, semester } = req.body;

    // Validation
    if (!registrationNumber || !name || !email || !password || !branch) {
      throw new AppError('Please provide all required fields', 400);
    }

    const result = await this.authService.register({
      registrationNumber,
      name,
      email,
      password,
      branch,
      semester,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: result,
    });
  });

  /**
   * Login with email/password
   * POST /api/auth/login
   */
  login = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }

    const result = await this.authService.login(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  });

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }

    const tokens = await this.authService.refreshToken(refreshToken);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: tokens,
    });
  });

  /**
   * Get current user profile
   * GET /api/auth/me
   */
  getProfile = catchAsync(async (req, res) => {
    const student = await this.authService.getProfile(req.student.studentId);

    res.status(200).json({
      success: true,
      data: { student },
    });
  });

  /**
   * Update current user profile
   * PUT /api/auth/me
   */
  updateProfile = catchAsync(async (req, res) => {
    const student = await this.authService.updateProfile(
      req.student.studentId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { student },
    });
  });

  /**
   * Logout (client-side token deletion)
   * POST /api/auth/logout
   */
  logout = catchAsync(async (req, res) => {
    // JWT is stateless - actual logout happens client-side by deleting token
    // This endpoint is for logging purposes or future token blacklisting
    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  });

  /**
   * Google OAuth callback handler
   * GET /api/auth/google/callback
   */
  googleCallback = catchAsync(async (req, res) => {
    // User is attached by passport middleware
    if (!req.user) {
      throw new AppError('Google authentication failed', 401);
    }

    // Remove password from response
    const { password, ...studentWithoutPassword } = req.user;

    // Generate tokens
    const tokens = this.authService.generateTokens(studentWithoutPassword);

    // Redirect to frontend with tokens
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUrl = `${frontendUrl}/auth/callback?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`;

    res.redirect(redirectUrl);
  });
}

module.exports = AuthController;
