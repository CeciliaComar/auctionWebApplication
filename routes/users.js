import express from 'express';
import { getUsers, getUserById } from '../controllers/usersController.js';  // Import the controller

const router = express.Router();

// Define route for getting users with query filtering
router.get('/', getUsers);  // This is the route for listing and filtering users
router.get('/:id', getUserById);// Route to get user by ID
export default router;