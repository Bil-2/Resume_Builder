import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

// @desc    Google OAuth Sign In / Sign Up
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = async (req, res, next) => {
  try {
    const { credential, firstName, lastName, email, googleId, profileImage } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({
        success: false,
        message: 'Email and Google ID are required'
      });
    }

    // Check if user exists with this Google ID
    let user = await User.findOne({ googleId });

    if (user) {
      // User exists with Google ID - log them in
      user.lastLogin = Date.now();
      await user.save();

      const token = generateToken(user._id);

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: user.getPublicProfile(),
          token
        }
      });
    }

    // Check if user exists with this email (from local auth)
    user = await User.findOne({ email });

    if (user) {
      // User exists with email but not Google ID - link accounts
      if (user.authProvider === 'google') {
        // Already a Google user, update Google ID
        user.googleId = googleId;
      } else {
        // Local user, convert to Google auth
        user.authProvider = 'google';
        user.googleId = googleId;
        user.password = undefined; // Remove password requirement
      }

      if (profileImage) {
        user.profileImage = profileImage;
      }

      user.lastLogin = Date.now();
      await user.save();

      const token = generateToken(user._id);

      return res.status(200).json({
        success: true,
        message: 'Account linked and logged in successfully',
        data: {
          user: user.getPublicProfile(),
          token
        }
      });
    }

    // New user - create account
    user = await User.create({
      firstName: firstName || email.split('@')[0],
      lastName: lastName || '',
      email,
      googleId,
      authProvider: 'google',
      profileImage: profileImage || null,
      isVerified: true, // Auto-verify Google users
      lastLogin: Date.now()
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: user.getPublicProfile(),
        token
      }
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    next(error);
  }
};
