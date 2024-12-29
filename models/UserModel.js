import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';  // To hash passwords
import { generateToken } from '../services/authService.js';  // Use the generateToken function from authService

// Define the schema for the User
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,  // Ensure the username is unique
    trim: true,  // Remove extra spaces
  },
  password: {
    type: String,
    required: true,  // Password is required
  },
  name: {
    type: String,
    required: true,  // First name is required
  },
  surname: {
    type: String,
    required: true,  // Surname is required
  },
  createdAt: {
    type: Date,
    default: Date.now,  // Automatically set the creation date
  }
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);  // Hash password with a salt of 10 rounds
  }
  next();
});

// Compare the provided password with the stored hashed password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);  // Return true if the passwords match
};

// Generate JWT token using the generateToken function from authService.js
userSchema.methods.generateAuthToken = function () {
  return generateToken(this);  // Generate the token using the user object
};

// Create and export the model
const User = mongoose.model('User', userSchema);

export default User;
