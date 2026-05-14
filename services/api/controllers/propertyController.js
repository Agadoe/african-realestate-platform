const Property = require('../models/Property');
const User = require('../models/User');
const { propertyScore } = require('../utils/ai');

// Get all properties with filtering and pagination
exports.getProperties = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      propertyType,
      listingType,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      city,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const filter = {};

    if (propertyType) filter.propertyType = propertyType;
    if (listingType) filter.listingType = listingType;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (bedrooms) filter.bedrooms = Number(bedrooms);
    if (bathrooms) filter.bathrooms = Number(bathrooms);
    if (city) filter['address.city'] = new RegExp(city, 'i');

    const sort = {};
    sort[sortBy] = order === 'asc' ? 1 : -1;

    const skip = (Number(page) - 1) * Number(limit);

    const properties = await Property.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate('agentId', 'firstName lastName agencyName rating reviewCount');

    const total = await Property.countDocuments(filter);

    res.json({
      properties,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
};

// Get a single property by ID
exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('agentId', 'firstName lastName agencyName rating reviewCount verificationStatus')
      .populate('ownerId', 'firstName lastName phone')
      .populate('neighborhoodId', 'name description priceTrends');

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
};

// Search properties with semantic search
exports.searchProperties = async (req, res) => {
  try {
    const { query, filters = {} } = req.body;

    const searchFilter = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { 'address.city': { $regex: query, $options: 'i' } },
        { 'address.region': { $regex: query, $options: 'i' } }
      ],
      ...filters
    };

    const properties = await Property.find(searchFilter)
      .populate('agentId', 'firstName lastName agencyName rating reviewCount');

    res.json({
      properties,
      total: properties.length,
      query
    });
  } catch (error) {
    console.error('Error searching properties:', error);
    res.status(500).json({ error: 'Failed to search properties' });
  }
};

// Create a new property (agents and owners only)
exports.createProperty = async (req, res) => {
  try {
    const { role } = req.user;

    // Only agents and owners can create listings
    if (!['agent', 'owner'].includes(role)) {
      return res.status(403).json({ error: 'Only agents and property owners can create listings' });
    }

    const propertyData = {
      ...req.body,
      agentId: role === 'agent' ? req.user.id : null,
      ownerId: req.user.id,
      listingScore: await propertyScore(req.body),
      status: 'pending'
    };

    const property = new Property(propertyData);
    await property.save();

    await property.populate('agentId', 'firstName lastName agencyName rating reviewCount');
    if (!property.agentId) {
      await property.populate('ownerId', 'firstName lastName phone');
    }

    res.status(201).json(property);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
};

// Update a property (agents and owners)
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const isAgent = req.user.role === 'agent' && property.agentId && property.agentId.toString() === req.user.id;
    const isOwner = req.user.role === 'owner' && property.ownerId && property.ownerId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isAgent && !isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to update this property' });
    }

    // Prevent role escalation: agents can't edit owner-listed properties and vice versa
    if (isAgent && property.ownerId && property.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this property' });
    }

    Object.assign(property, req.body);

    if (req.body.price || req.body.bedrooms || req.body.bathrooms || req.body.area) {
      property.listingScore = await propertyScore(property);
    }

    await property.save();

    await property.populate('agentId', 'firstName lastName agencyName rating reviewCount');
    if (!property.agentId) {
      await property.populate('ownerId', 'firstName lastName phone');
    }

    res.json(property);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
};

// Delete a property (agents and owners)
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const isAgent = req.user.role === 'agent' && property.agentId && property.agentId.toString() === req.user.id;
    const isOwner = req.user.role === 'owner' && property.ownerId && property.ownerId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isAgent && !isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to delete this property' });
    }

    if (isAgent && property.ownerId && property.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this property' });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
};

// Get current user's (owner's) property listings
exports.getMyListings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = { ownerId: req.user.id };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const properties = await Property.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('agentId', 'firstName lastName agencyName rating reviewCount');

    const total = await Property.countDocuments(filter);

    res.json({
      properties,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    console.error('Error fetching owner listings:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
};

// Get user's favorite properties
exports.getUserFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
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

    res.json(user.favorites);
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
};

// Add property to user's favorites
exports.addFavorite = async (req, res) => {
  try {
    const { userId } = req.params;
    const { propertyId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

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
    const { userId, propertyId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

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

// Get AI-powered property recommendations
exports.getRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const properties = await Property.find({
      status: 'active',
      listingType: user.preferences?.preferredListingType || 'sale'
    })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('agentId', 'firstName lastName agencyName rating reviewCount');

    res.json(properties);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
};