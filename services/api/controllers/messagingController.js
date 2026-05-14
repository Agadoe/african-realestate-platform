const User = require('../models/User');
const Property = require('../models/Property');

// Send inquiry about a property
exports.sendInquiry = async (req, res) => {
  try {
    const { propertyId, message, buyerId, agentId } = req.body;

    // Validate input
    if (!propertyId || !message || !buyerId || !agentId) {
      return res.status(400).json({ error: 'Property ID, message, buyer ID, and agent ID are required' });
    }

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Check if buyer exists
    const buyer = await User.findById(buyerId);
    if (!buyer) {
      return res.status(404).json({ error: 'Buyer not found' });
    }

    // Check if agent exists
    const agent = await User.findById(agentId);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // In a real implementation, this would save the inquiry to a database
    // and potentially send notifications to the agent
    // For now, we'll just return a success message

    // Simulate saving inquiry
    const inquiry = {
      id: Date.now().toString(),
      propertyId,
      buyerId,
      agentId,
      message,
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.status(201).json({
      message: 'Inquiry sent successfully',
      inquiry
    });
  } catch (error) {
    console.error('Error sending inquiry:', error);
    res.status(500).json({ error: 'Failed to send inquiry' });
  }
};

// Get user's inquiries
exports.getUserInquiries = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is authorized to view these inquiries
    if (user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to view these inquiries' });
    }

    // In a real implementation, this would fetch inquiries from a database
    // For now, we'll return mock data

    const inquiries = [
      {
        id: '1',
        propertyId: 'property1',
        buyerId: userId,
        agentId: 'agent1',
        message: 'I am interested in this property. Can you provide more details?',
        status: 'new',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        propertyId: 'property2',
        buyerId: userId,
        agentId: 'agent2',
        message: 'When is the next available viewing for this property?',
        status: 'contacted',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-21')
      }
    ];

    res.json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
};

// Send message between users
exports.sendMessage = async (req, res) => {
  try {
    const { senderId, recipientId, content } = req.body;

    // Validate input
    if (!senderId || !recipientId || !content) {
      return res.status(400).json({ error: 'Sender ID, recipient ID, and content are required' });
    }

    // Check if sender exists
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ error: 'Sender not found' });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    // Check if user is authorized to send this message
    if (senderId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to send this message' });
    }

    // In a real implementation, this would save the message to a database
    // For now, we'll just return a success message

    // Simulate saving message
    const message = {
      id: Date.now().toString(),
      senderId,
      recipientId,
      content,
      status: 'sent',
      createdAt: new Date()
    };

    res.status(201).json({
      message: 'Message sent successfully',
      message
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Get user's messages
exports.getUserMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is authorized to view these messages
    if (user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to view these messages' });
    }

    // In a real implementation, this would fetch messages from a database
    // For now, we'll return mock data

    const messages = [
      {
        id: '1',
        senderId: 'user1',
        recipientId: userId,
        content: 'Hello, I am interested in the property you listed.',
        status: 'read',
        createdAt: new Date('2024-01-15')
      },
      {
        id: '2',
        senderId: userId,
        recipientId: 'user2',
        content: 'Thank you for your interest. When would you like to schedule a viewing?',
        status: 'sent',
        createdAt: new Date('2024-01-16')
      }
    ];

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};