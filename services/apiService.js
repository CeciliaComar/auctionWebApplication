import mongoose from 'mongoose';
import RecordModel from '../models/RecordModel.js';  // Assuming you have a Mongoose model for your records

/**
 * Function to fetch a record by ID from the MongoDB database
 * @param {string} id - The ID of the record to fetch
 * @param {Object} queryParams - Optional query parameters to filter the result
 * @returns {Promise<Object>} - The record object
 */
export const fetchRecord = async (id, queryParams = {}) => {
  try {
    // If you have queryParams (e.g., search term), you can filter the results here.
    const filter = { _id: id, ...queryParams };  // Apply the queryParams filter

    // Find the record by ID and any query parameters
    const record = await RecordModel.findOne(filter);
    
    // If no record found, throw an error
    if (!record) {
      throw new Error('Record not found');
    }

    return record;  // Return the record
  } catch (error) {
    throw new Error('Error fetching record: ' + error.message);
  }
};
