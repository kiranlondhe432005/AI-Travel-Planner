import jwt from 'jsonwebtoken';

/**
 * Generates a JWT token for a given user ID
 * @param {string} userId - The user ID
 * @returns {string} - Signed JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'your_jwt_secret_key_here_travel_planner_2026',
    {
      expiresIn: '30d',
    }
  );
};
