const jwt = require('jsonwebtoken');
const User = require('../models/User');

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable must be set');
}

// Authenticate token middleware
exports.authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Authorize role middleware
exports.authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// Authorize ownership middleware
exports.authorizeOwnership = (Model, idField = 'id') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const resourceId = req.params[idField];
      const resource = await Model.findById(resourceId);

      if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      if (resource.userId && resource.userId.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to access this resource' });
      }

      if (resource.agentId && resource.agentId.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to access this resource' });
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      res.status(500).json({ error: 'Authorization failed' });
    }
  };
};