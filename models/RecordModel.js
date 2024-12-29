import mongoose from 'mongoose';

// Define the schema for your record
const recordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,  // This field is mandatory
    trim: true,      // Removes extra spaces from the beginning and end of the string
  },
  description: {
    type: String,
    required: false,  // This field is optional
    trim: true,       // Removes extra spaces from the beginning and end of the string
  },
  createdAt: {
    type: Date,
    default: Date.now,  // Automatically set to the current date and time when the record is created
  },
  updatedAt: {
    type: Date,
    default: Date.now,  // Automatically set to the current date and time when the record is created
  }
});

// Add a pre-save hook to update the `updatedAt` field before saving the record
recordSchema.pre('save', function (next) {
  this.updatedAt = Date.now();  // Set `updatedAt` to the current date and time
  next();
});

// Create and export the Mongoose model based on the schema
const RecordModel = mongoose.model('Record', recordSchema);

export default RecordModel;
