const Agent = require('../models/Agent');
const User = require('../models/User');
const Property = require('../models/Property');

// Get all agents with filtering and pagination
exports.getAgents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      agency,
      minRating,
      sortBy = 'rating',
      order = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};

    if (agency) filter.agencyName = new RegExp(agency, 'i');
    if (minRating) filter.rating = { $gte: Number(minRating) };

    // Build sort object
    const sort = {};
    sort[sortBy] = order === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Fetch agents
    const agents = await Agent.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate('userId', 'firstName lastName email phone');

    // Get total count for pagination
    const total = await Agent.countDocuments(filter);

    res.json({
      agents,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
};

// Get a single agent by ID
exports.getAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id)
      .populate('userId', 'firstName lastName email phone');

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    res.json(agent);
  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({ error: 'Failed to fetch agent' });
  }
};

// Get agent's reviews
exports.getAgentReviews = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // In a real implementation, this would fetch actual reviews from a Review model
    // For now, we'll return mock reviews

    const reviews = [
      {
        id: 1,
        reviewerId: 'user1',
        rating: 5,
        title: 'Excellent Service',
        comment: 'Kwame helped me find my dream home in record time. Highly recommended!',
        verified: true,
        createdAt: new Date('2024-01-15')
      },
      {
        id: 2,
        reviewerId: 'user2',
        rating: 4,
        title: 'Professional and Knowledgeable',
        comment: 'Great communication and deep knowledge of the local market.',
        verified: true,
        createdAt: new Date('2024-02-20')
      }
    ];

    res.json({
      reviews,
      averageRating: agent.rating,
      totalReviews: agent.reviewCount
    });
  } catch (error) {
    console.error('Error fetching agent reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// Update agent profile (agent only)
exports.updateAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Check if user is the agent
    if (agent.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this agent profile' });
    }

    // Update agent data
    Object.assign(agent, req.body);
    await agent.save();

    // Populate user info before sending response
    await agent.populate('userId', 'firstName lastName email phone');

    res.json(agent);
  } catch (error) {
    console.error('Error updating agent:', error);
    res.status(500).json({ error: 'Failed to update agent' });
  }
};

// Verify agent (agent only)
exports.verifyAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Check if user is the agent
    if (agent.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to verify this agent' });
    }

    // In a real implementation, this would process verification documents
    // For now, we'll just update the verification status

    agent.verificationStatus = 'verified';
    agent.verificationDocuments = req.body.documents || [];
    await agent.save();

    res.json({ message: 'Agent verification submitted successfully' });
  } catch (error) {
    console.error('Error verifying agent:', error);
    res.status(500).json({ error: 'Failed to verify agent' });
  }
};