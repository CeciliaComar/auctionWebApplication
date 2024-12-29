// middleware/auth.js
//import jwt from 'jsonwebtoken';

/*const SECRET_KEY = 'your-secret-key';  // Secret key to sign the JWT

// Middleware to authenticate using JWT
export function authenticateJWT(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];  // Get token from 'Authorization' header (Bearer token)

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  /*jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden: Invalid token' });
    }
    req.user = user;  // Add the decoded user info to the request object
    next();  // Proceed to the next middleware/route handler
  });
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach user information to the request object
    next();  // Proceed to the next middleware/controller
  } catch (error) {
    console.error('Invalid token:', error);
    res.status(403).json({ message: 'Invalid token.' });
  }
};*/

/*import jwt from 'jsonwebtoken';
import User from '../models/User.js';*/

/*export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];

  /*jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user; // Attach the user information to the request
    next();
  });*//*

  try {
    // Verify the token and decode it to get the user info
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure that your secret key is set properly
    req.user = decoded; // Attach the user to the request object
    next(); // Continue to the next middleware or controller
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};
*/
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

export const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    req.user = user; // Attach the user info to the request
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
