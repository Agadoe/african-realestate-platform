const Neighborhood = require('../models/Neighborhood');
const Property = require('../models/Property');

// Get all neighborhoods with filtering and pagination
exports.getNeighborhoods = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      city,
      region,
      minSafetyScore,
      sortBy = 'safetyScore',
      order = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};

    if (city) filter.city = new RegExp(city, 'i');
    if (region) filter.region = new RegExp(region, 'i');
    if (minSafetyScore) filter.safetyScore = { $gte: Number(minSafetyScore) };

    // Build sort object
    const sort = {};
    sort[sortBy] = order === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Fetch neighborhoods
    const neighborhoods = await Neighborhood.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const total = await Neighborhood.countDocuments(filter);

    res.json({
      neighborhoods,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    console.error('Error fetching neighborhoods:', error);
    res.status(500).json({ error: 'Failed to fetch neighborhoods' });
  }
};

// Get a single neighborhood by ID
exports.getNeighborhood = async (req, res) => {
  try {
    const neighborhood = await Neighborhood.findById(req.params.id);

    if (!neighborhood) {
      return res.status(404).json({ error: 'Neighborhood not found' });
    }

    res.json(neighborhood);
  } catch (error) {
    console.error('Error fetching neighborhood:', error);
    res.status(500).json({ error: 'Failed to fetch neighborhood' });
  }
};

// Get neighborhood intelligence data
exports.getNeighborhoodIntelligence = async (req, res) => {
  try {
    const neighborhood = await Neighborhood.findById(req.params.id);

    if (!neighborhood) {
      return res.status(404).json({ error: 'Neighborhood not found' });
    }

    // Get properties in this neighborhood
    const properties = await Property.find({
      'address.coordinates': {
        $geoWithin: {
          $geometry: neighborhood.coordinates
        }
      }
    });

    // Calculate market statistics
    const priceHistory = neighborhood.priceTrends || [];
    const avgPrice = priceHistory.length > 0
      ? priceHistory[priceHistory.length - 1].averagePrice
      : 0;

    const priceChange = priceHistory.length > 1
      ? priceHistory[priceHistory.length - 1].priceChange
      : 0;

    // Property type distribution
    const propertyTypes = {};
    properties.forEach(property => {
      propertyTypes[property.propertyType] = (propertyTypes[property.propertyType] || 0) + 1;
    });

    res.json({
      neighborhood: {
        ...neighborhood.toObject(),
        propertyCount: properties.length,
        averagePrice: avgPrice,
        priceChange: priceChange,
        propertyTypes: propertyTypes
      },
      marketInsights: {
        priceTrend: neighborhood.priceTrends,
        safetyScore: neighborhood.safetyScore,
        infrastructureScore: neighborhood.infrastructureScore,
        appreciationRate: neighborhood.appreciationRate
      }
    });
  } catch (error) {
    console.error('Error fetching neighborhood intelligence:', error);
    res.status(500).json({ error: 'Failed to fetch neighborhood intelligence' });
  }
};