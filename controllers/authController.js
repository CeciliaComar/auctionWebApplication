import User from '../models/UserModel.js';  // Import the User model
import { generateToken } from '../services/authService.js';  // Import the generateToken function

export const signup = async (req, res) => {
  const { username, password, name, surname } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create a new user
    const newUser = new User({ username, password, name, surname });
    await newUser.save();  // Save the user to the database

    // Generate a JWT token
   // const token = newUser.generateAuthToken();

    res.status(201).json({
      message: 'User created successfully',
     // token,
      user: { username: newUser.username, name: newUser.name, surname: newUser.surname },
    });
  } catch (error) {
    console.error('Signup error:', error); // Add this to log the error
    res.status(500).json({ error: 'Error creating user: ' + error.message });
  }
};


export const signin = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Find the user by username
      const user = await User.findOne({ username });
      console.log(user);//debuggin
      if (!user) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }
  
      // Compare the entered password with the stored hashed password
      const isMatch = await user.comparePassword(password);
      console.log(isMatch);//debugging
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }
  
      // Generate JWT token
      const token = user.generateAuthToken();
      console.log(token);//debugging
  
      res.status(200).json({
        message: 'Login successful',
        token,
        user: { username: user.username, name: user.name, surname: user.surname },
      });
    } catch (error) {
      res.status(500).json({ error: 'Error logging in: ' + error.message });
    }
  };

  export const whoAmI = (req, res) => {
    try {
      const user = req.user; // Assuming `req.user` is set after authentication middleware
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized: No user information available' });
      }
      res.status(200).json({
        user: {
          username: user.username,
          name: user.name,
          surname: user.surname,
        },
      });
    } catch (error) {
      console.error('Error in whoAmI:', error);
      res.status(500).json({ message: 'Failed to fetch user information' });
    }
  };