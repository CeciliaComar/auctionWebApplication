import Auction from "../models/AuctionModel.js";
import User from "../models/UserModel.js";
import Bid from "../models/BidModel.js";

export const listOfAuctions = async (req, res) => {
    try {
    const { search = '', status } = req.query;

    // Build the query
    const query = {
        ...(search && { 
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ]
        }),
        ...(status === 'active' && { expirationDate: { $gt: new Date() } }),
        ...(status === 'expired' && { expirationDate: { $lte: new Date() } }),
    };

    // Fetch auctions from the database
    const auctions = await Auction.find(query).maxTimeMS(10000);

    res.status(200).json(auctions || []); //this explicitly ensures that an empty array is returned in case auctions somehow resolves to a falsy value (which is unlikely but safe to check).
} catch (error) {
    console.error('Error fetching auctions:', error);
    res.status(500).json({ message: 'Failed to fetch auctions' });
}
};

export const createAuction = async (req, res) => {
  try {
    // Extract auction details from the request body
    const { description, expirationDate, startingPrice, title } = req.body;
    console.log('Received expirationDate:', expirationDate);
    // Validate request body
    if (!title || !description || !expirationDate || !startingPrice) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    console.log('Auction data received:', req.body);  // Debugging

    // Create a new auction
    const newAuction = new Auction({
      description,
      expirationDate: new Date(expirationDate),
      startingPrice,
      title,
      currentPrice: startingPrice,  // Initialize current bid with the starting bid
      createdBy: req.user.id,   // User ID from the authenticated token
    });

    // Save the auction to the database
    console.log('Saving auction to the database...');
    await newAuction.save();

    res.status(201).json({ message: 'Auction created successfully!', auction: newAuction });
  } catch (error) {
    console.error('Error creating auction:', error);
    res.status(500).json({ message: 'Failed to create auction.' });
  }
};

// Controller to handle auction search by title
export const searchAuctionByTitle = async (req, res) => {
  try {
    const { title } = req.query;

    // Fetch the auction by title (case-insensitive)
    const auction = await Auction.findOne({ title: { $regex: title, $options: 'i' } });

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    res.status(200).json(auction); // Return the found auction
  } catch (error) {
    console.error('Error searching auction by title:', error);
    res.status(500).json({ message: 'Failed to fetch auction' });
  }
};

// Controller to handle auction update
export const updateAuction = async (req, res) => {
  const { title, description} = req.body;
  const auctionId = req.params.id;

  try {
    // Find the auction by ID
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    // Ensure the user is the one who created the auction
    if (auction.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to update this auction' });
    }

    // Update auction details
    auction.title = title || auction.title;
    auction.description = description || auction.description;
    

    // Save the updated auction
    await auction.save();

    res.status(200).json({ message: 'Auction updated successfully', auction });
  } catch (error) {
    console.error('Error updating auction:', error);
    res.status(500).json({ message: 'Failed to update auction' });
  }
};

export const getAuctionDetails = async (req, res) => {
  try {
    // Get the auction ID from the request params
    const auctionId = req.params.id;

    // Find the auction by ID
    const auction = await Auction.findById(auctionId)
      .populate('createdBy', 'username name surname') // Populate the creator details (optional)
      .populate('winningUser', 'username name surname')  // Populate the winning user's details
      .exec();

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    // If there's a current bid, fetch the winning user (if applicable)
    let winningUser = null;
    if (auction.currentPrice && auction.createdBy) {
      winningUser = await User.findById(auction.createdBy);
    }

    // Respond with auction details, including current bid and winner (if available)
    res.status(200).json({
      auction: {
        title: auction.title,
        description: auction.description,
        startingPrice: auction.startingPrice,
        currentPrice: auction.currentPrice,
        expirationDate: auction.expirationDate,
        createdBy: auction.createdBy,
        winningUser: auction.winningUser,
      },
    });
  } catch (error) {
    console.error('Error fetching auction details:', error);
    res.status(500).json({ message: 'Failed to fetch auction details' });
  }
};

export const deleteAuction = async (req, res) => {
  try {
    console.log('Authenticated user:', req.user); // Check if the user is being set correctly
    const auctionId = req.params.id; // Extract the auction ID from the request URL
    const userId = req.user.id; // Get the user ID from the authenticated token

    // Find the auction by its ID
    const auction = await Auction.findById(auctionId);

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    // Check if the user is the creator of the auction
    if (auction.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this auction' });
    }

    // Delete the auction
    await auction.deleteOne();

    res.status(200).json({ message: 'Auction deleted successfully' });
  } catch (error) {
    console.error('Error deleting auction:', error);
    res.status(500).json({ message: 'Failed to delete auction' });
  }
};

export const createBidForAuction = async (req, res) => {
    const auctionId = req.params.id; // Extract auction ID from the URL
    const { amount } = req.body; // Extract bid amount from the request body
    const userId = req.user.id; // Authenticated user's ID

    try {
        // Check if the auction exists
        const auction = await Auction.findById(auctionId);
        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }

        // Check if the auction is still active
        if (new Date(auction.expirationDate) <= new Date()) {
            return res.status(400).json({ message: 'Auction has already expired' });
        }

        // Ensure the bid amount is greater than the current price
        if (amount <= (auction.currentPrice || auction.startingPrice)) {
            return res.status(400).json({ message: 'Bid amount must be higher than the current price.' });
        }

        // Create a new bid
        const newBid = new Bid({
            amount,
            user: userId, // Associate the bid with the authenticated user
            auction: auctionId, // Associate the bid with the auction
        });

        // Save the bid to the database
        await newBid.save();

        // Update the auction's current price and winning user
        auction.currentPrice = amount;
        auction.winningUser = userId;
        await auction.save();

        res.status(201).json({ message: 'Bid placed successfully.', bid: newBid });
    } catch (error) {
        console.error('Error creating bid:', error);
        res.status(500).json({ message: 'Failed to place bid.' });
    }
};


export const listBidsForAuction = async (req, res) => {
  const auctionId = req.params.id;

  try {
    // Find the auction to ensure it exists
    const auction = await Auction.findById(auctionId);

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    // Find all bids for this auction, sorted by amount in descending order
    const bids = await Bid.find({ auction: auctionId })
      .populate('user', 'username name surname') // Populate user details
      .sort({ amount: -1 }) // Sort by bid amount descending
      .exec();

    res.status(200).json({ bids });
  } catch (error) {
    console.error('Error fetching bids:', error);
    res.status(500).json({ message: 'Failed to fetch bids.' });
  }
};