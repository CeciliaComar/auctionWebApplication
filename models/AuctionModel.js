import mongoose from 'mongoose';

const AuctionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    startingPrice: { type: Number, required: true },
    currentPrice: { type: Number, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
    winningUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Reference to the current highest bidder
});

const Auction = mongoose.model('Auction', AuctionSchema);
export default Auction;
