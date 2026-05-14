const User = require('../models/User');
const Property = require('../models/Property');

// Get user profile
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is authorized to view this profile
    if (user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to view this user profile' });
    }

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Update user profile
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is authorized to update this profile
    if (user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this user profile' });
    }

    // Update user data
    const { firstName, lastName, email, phone, address } = req.body;

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Get user's favorite properties
exports.getUserFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate({
        path: 'favorites',
        populate: {
          path: 'agentId',
          select: 'firstName lastName agencyName rating reviewCount'
        }
      });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is authorized to view these favorites
    if (user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to view these favorites' });
    }

    res.json(user.favorites);
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
};

// Add property to user's favorites
exports.addFavorite = async (req, res) => {
  try {
    const { propertyId } = req.body;

    // Check if user exists
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is authorized to modify these favorites
    if (user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to modify these favorites' });
    }

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Add property to favorites if not already there
    if (!user.favorites.includes(propertyId)) {
      user.favorites.push(propertyId);
      await user.save();
    }

    res.json({ message: 'Property added to favorites' });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
};

// Remove property from user's favorites
exports.removeFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Check if user exists
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is authorized to modify these favorites
    if (user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to modify these favorites' });
    }

    // Remove property from favorites
    user.favorites = user.favorites.filter(
      fav => fav.toString() !== propertyId
    );
    await user.save();

    res.json({ message: 'Property removed from favorites' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
};