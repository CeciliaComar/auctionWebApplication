import express from 'express';
import { getBidDetails } from '../controllers/bidController.js';

const router = express.Router();

// Route for fetching bid details by ID
router.get('/:id', getBidDetails);

export default router;
