import express from 'express';
import { db } from '../database/connection';
import { logger } from '../utils/logger';
import { verifyGoogleToken, generateJWT } from '../middleware/auth';
import { CustomError } from '../middleware/errorHandler';

const router = express.Router();

// Google OAuth login
router.post('/auth/google', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Google token is required' });
    }

    // Verify Google token
    const googleUser = await verifyGoogleToken(token);
    
    // Check if user exists
    let user = await db('users')
      .where('google_id', googleUser.googleId)
      .first();

    if (!user) {
      // Create new user
      [user] = await db('users')
        .insert({
          email: googleUser.email,
          name: googleUser.name,
          google_id: googleUser.googleId,
          picture_url: googleUser.picture,
          created_at: new Date(),
          updated_at: new Date()
        })
        .returning('*');
      
      logger.info('New user created:', { userId: user.id, email: user.email });
    } else {
      // Update existing user
      [user] = await db('users')
        .where('id', user.id)
        .update({
          email: googleUser.email,
          name: googleUser.name,
          picture_url: googleUser.picture,
          updated_at: new Date()
        })
        .returning('*');
      
      logger.info('User updated:', { userId: user.id, email: user.email });
    }

    // Generate JWT token
    const jwtToken = generateJWT(user);

    res.json({
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture_url
      }
    });
  } catch (error) {
    logger.error('Google authentication failed:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Get user from token (we'll implement this in middleware)
    // For now, just return a simple response
    res.json({ message: 'Profile endpoint - implement token verification' });
  } catch (error) {
    logger.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    // Implementation for updating user profile
    res.json({ message: 'Profile update endpoint - to be implemented' });
  } catch (error) {
    logger.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Delete user account
router.delete('/account', async (req, res) => {
  try {
    // Implementation for deleting user account
    res.json({ message: 'Account deletion endpoint - to be implemented' });
  } catch (error) {
    logger.error('Error deleting user account:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

export default router; 