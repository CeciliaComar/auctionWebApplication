// routes/auth.js
import express from 'express';
import { signup, signin } from '../controllers/authController.js';  // Import the controller functions

const router = express.Router();

// Route to login and generate a token
router.post('/signin', signin);

router.post('/signup', signup);

export default router;
