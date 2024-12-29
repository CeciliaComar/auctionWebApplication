import express from 'express';
import { listOfAuctions, createAuction, updateAuction, searchAuctionByTitle, getAuctionDetails, deleteAuction, listBidsForAuction, createBidForAuction } from '../controllers/auctionController.js';  // Import the controller functions
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, createAuction);
router.get('/', listOfAuctions);
router.get('/search', /*authenticate,*/ searchAuctionByTitle);
router.put('/:id', authenticate, updateAuction);
router.get('/:id', getAuctionDetails); // Route to get auction details by ID
router.delete('/:id', authenticate, deleteAuction);// This route will handle the auction deletion
router.post('/:id/bids', authenticate, createBidForAuction);
router.get('/:id/bids', listBidsForAuction); // Route to fetch bids for the auction by ID


export default router;
