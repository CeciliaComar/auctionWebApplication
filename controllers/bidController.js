import Auction from "../models/AuctionModel.js";
import User from "../models/UserModel.js";
import Bid from "../models/BidModel.js";

// Controller function to create a new bid
export const placeBid = async (req, res) => {
    try {
      const { auctionId, amount } = req.body;
      const userId = req.user.id; // Assuming the user is authenticated
  
      // Find the auction
      const auction = await Auction.findById(auctionId);
  
      if (!auction) {
        return res.status(404).json({ message: 'Auction not found' });
      }
  
      // Create a new bid
      const newBid = new Bid({
        amount,
        user: userId,
        auction: auctionId
      });
  
      // Save the bid
      await newBid.save();
  
      // Optionally, update the auction's current bid
      auction.currentPrice = amount;
      await auction.save();
  
      res.status(201).json({ message: 'Bid placed successfully', bid: newBid });
    } catch (error) {
      console.error('Error placing bid:', error);
      res.status(500).json({ message: 'Failed to place bid' });
    }
  };


  export const getBidDetails = async (req, res) => {
    try {
      const bidId = req.params.id;
  
      // Find the bid by its ID and populate the user and auction details
      const bid = await Bid.findById(bidId)
        .populate('user', 'username name surname') // Populate user info
        .populate('auction', 'title description') // Populate auction info
        .exec();
  
      if (!bid) {
        return res.status(404).json({ message: 'Bid not found' });
      }
  
      res.status(200).json({
        bid: {
          id: bid._id,
          amount: bid.amount,
          user: bid.user,
          auction: bid.auction,
          createdAt: bid.createdAt,
        },
      });
    } catch (error) {
      console.error('Error fetching bid details:', error);
      res.status(500).json({ message: 'Failed to fetch bid details' });
    }
  };
  

  