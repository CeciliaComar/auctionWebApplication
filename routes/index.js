import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { fetchRecord } from '../services/apiService.js';
import authRoutes from './auth.js';
import path from 'path';
import { fileURLToPath } from 'url';
import auctionRoutes from './auctions.js';
import bidRoutes from './bids.js';
import { whoAmI } from '../controllers/authController.js';
import userRoutes from './users.js';

// Convert the URL to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// Define routes
router.get('/api/whoami', authenticate, whoAmI);
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
});

router.use('/api/auth', authRoutes);
router.use('/api/auctions', auctionRoutes);
router.use('/api/bids', bidRoutes);
router.use('/api/users', userRoutes);


/*router.get('/api', (req, res) => {
  res.json({ message: 'Hello from the API!' });
});*/

export default router;
