// services/authService.js
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your-secret-key';  // Secret key to sign the JWT

export function generateToken(user) {
  // Generate a JWT token with the user's information
  return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });  // Token expires in 1 hour
};
