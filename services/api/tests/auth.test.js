const jwt = require('jsonwebtoken');

// Mock User model
const mockUser = {
  _id: '507f1f77bcf86cd799439011',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'buyer',
};

jest.mock('../models/User', () => ({
  findById: jest.fn(),
}));

const User = require('../models/User');
const { authenticateToken, authorizeRole, authorizeOwnership } = require('../middleware/auth');

describe('Auth Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {},
      params: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('authenticateToken', () => {
    it('should return 401 if no token provided', async () => {
      mockReq.headers.authorization = undefined;

      await authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Access token required' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', async () => {
      mockReq.headers.authorization = 'Bearer invalid-token';

      await authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 if user not found', async () => {
      const token = jwt.sign({ id: mockUser._id }, process.env.JWT_SECRET || 'test-secret');
      mockReq.headers.authorization = `Bearer ${token}`;
      User.findById.mockResolvedValue(null);

      await authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'User not found' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next and attach user if token is valid', async () => {
      const token = jwt.sign({ id: mockUser._id }, process.env.JWT_SECRET || 'test-secret');
      mockReq.headers.authorization = `Bearer ${token}`;
      User.findById.mockResolvedValue(mockUser);

      await authenticateToken(mockReq, mockRes, mockNext);

      expect(mockReq.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });

  describe('authorizeRole', () => {
    it('should return 401 if user is not authenticated', () => {
      mockReq.user = undefined;

      const middleware = authorizeRole(['admin']);
      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Authentication required' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 if user role is not authorized', () => {
      mockReq.user = { ...mockUser, role: 'buyer' };

      const middleware = authorizeRole(['admin', 'agent']);
      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Insufficient permissions' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next if user role is authorized', () => {
      mockReq.user = { ...mockUser, role: 'admin' };

      const middleware = authorizeRole(['admin', 'agent']);
      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });

  describe('authorizeOwnership', () => {
    const MockModel = {
      findById: jest.fn(),
    };

    beforeEach(() => {
      MockModel.findById.mockReset();
    });

    it('should return 401 if user is not authenticated', async () => {
      mockReq.user = undefined;

      const middleware = authorizeOwnership(MockModel);
      await middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Authentication required' });
    });

    it('should return 404 if resource is not found', async () => {
      mockReq.user = mockUser;
      mockReq.params.id = '507f1f77bcf86cd799439012';
      MockModel.findById.mockResolvedValue(null);

      const middleware = authorizeOwnership(MockModel);
      await middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Resource not found' });
    });

    it('should return 403 if user does not own the resource', async () => {
      mockReq.user = { ...mockUser, role: 'buyer' };
      mockReq.params.id = '507f1f77bcf86cd799439012';
      MockModel.findById.mockResolvedValue({
        userId: '507f1f77bcf86cd799439013',
        agentId: null,
      });

      const middleware = authorizeOwnership(MockModel);
      await middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not authorized to access this resource' });
    });

    it('should allow admin to access any resource', async () => {
      mockReq.user = { ...mockUser, role: 'admin' };
      mockReq.params.id = '507f1f77bcf86cd799439012';
      MockModel.findById.mockResolvedValue({
        userId: '507f1f77bcf86cd799439013',
        agentId: null,
      });

      const middleware = authorizeOwnership(MockModel);
      await middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
});