import User from '../models/UserModel.js';

// Get list of users with optional query filter
export const getUsers = async (req, res) => {
  try {
    const query = req.query.q || '';  // Get the query parameter, default to an empty string
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } }, // Case insensitive match for username
        { name: { $regex: query, $options: 'i' } }, // Case insensitive match for name
        { surname: { $regex: query, $options: 'i' } } // Case insensitive match for surname
      ]
    }).select('username name surname'); // Select only the relevant fields to return

    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Get user details by ID
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user by ID
    const user = await User.findById(userId).select('username name surname createdAt');  // Customize the fields to return

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with user details
    res.status(200).json({
      user: {
        username: user.username,
        name: user.name,
        surname: user.surname,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
};

