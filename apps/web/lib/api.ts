import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://african-realestate-platform.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Property API ───────────────────────────────────────────────────────────────

export const propertyApi = {
  getProperties: (params?: Record<string, any>) =>
    api.get('/properties', { params }),

  getProperty: (id: string) =>
    api.get(`/properties/${id}`),

  createProperty: (propertyData: Record<string, any>) =>
    api.post('/properties', propertyData),

  updateProperty: (id: string, propertyData: Record<string, any>) =>
    api.put(`/properties/${id}`, propertyData),

  deleteProperty: (id: string) =>
    api.delete(`/properties/${id}`),

  searchProperties: (query: string, filters?: Record<string, any>) =>
    api.post('/properties/search', { query, filters }),

  getOwnerListings: () =>
    api.get('/properties/my-listings'),

  getRecommendations: (userId: string) =>
    api.get(`/properties/recommendations/${userId}`),

  getFavorites: (userId: string) =>
    api.get(`/users/${userId}/favorites`),

  addFavorite: (userId: string, propertyId: string) =>
    api.post(`/users/${userId}/favorites`, { propertyId }),

  removeFavorite: (userId: string, propertyId: string) =>
    api.delete(`/users/${userId}/favorites/${propertyId}`),
};

// ─── Agent API ────────────────────────────────────────────────────────────────

export const agentApi = {
  getAgents: (params?: Record<string, any>) =>
    api.get('/agents', { params }),

  getAgent: (id: string) =>
    api.get(`/agents/${id}`),

  getAgentReviews: (agentId: string) =>
    api.get(`/agents/${agentId}/reviews`),

  verifyAgent: (agentId: string, documents: Record<string, any>) =>
    api.post(`/agents/${agentId}/verify`, { documents }),
};

// ─── Neighborhood API ────────────────────────────────────────────────────────

export const neighborhoodApi = {
  getNeighborhoods: (params?: Record<string, any>) =>
    api.get('/neighborhoods', { params }),

  getNeighborhood: (id: string) =>
    api.get(`/neighborhoods/${id}`),

  getNeighborhoodIntelligence: (id: string) =>
    api.get(`/neighborhoods/${id}/intelligence`),
};

// ─── User API ─────────────────────────────────────────────────────────────────

export const userApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
    role?: string;
  }) =>
    api.post('/auth/register', userData),

  getProfile: (userId: string) =>
    api.get(`/users/${userId}`),

  updateProfile: (userId: string, userData: Record<string, any>) =>
    api.put(`/users/${userId}`, userData),
};

// ─── Messaging API ───────────────────────────────────────────────────────────

export const messagingApi = {
  sendInquiry: (inquiryData: Record<string, any>) =>
    api.post('/messaging/inquiries', inquiryData),

  sendMessage: (messageData: Record<string, any>) =>
    api.post('/messaging/messages', messageData),

  getMessages: (userId: string) =>
    api.get(`/messaging/messages/${userId}`),
};

// ─── Analytics API ────────────────────────────────────────────────────────────

export const analyticsApi = {
  trackView: (propertyId: string, userId?: string) =>
    api.post('/analytics/views', { propertyId, userId }),

  trackSearch: (searchData: Record<string, any>) =>
    api.post('/analytics/searches', searchData),

  trackConversion: (conversionData: Record<string, any>) =>
    api.post('/analytics/conversions', conversionData),
};

// ─── AI Services ──────────────────────────────────────────────────────────────

export const aiApi = {
  semanticSearch: (query: string, context?: Record<string, any>) =>
    api.post('/ai/search', { query, context }),

  getRecommendations: (userId: string, preferences?: Record<string, any>) =>
    api.post('/ai/recommendations', { userId, preferences }),

  calculatePropertyScore: (propertyData: Record<string, any>) =>
    api.post('/ai/property-score', propertyData),
};

export default api;

// ─── Upload API (Cloudinary) ─────────────────────────────────────────────────

// Extend the api instance with an uploadFile method
(api as any).uploadFile = async function (url: string, formData: FormData) {
  // Use the api instance directly — interceptors run automatically
  const response = await api.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const uploadApi = {
  uploadImage: (file: File | Blob): Promise<{ url: string; public_id: string; width: number; height: number }> => {
    const formData = new FormData();
    formData.append('image', file);
    return (api as any).uploadFile('/upload/image', formData);
  },

  uploadImages: (files: (File | Blob)[]): Promise<{ images: Array<{ url: string; public_id: string; width: number; height: number }>; count: number }> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    return (api as any).uploadFile('/upload/images', formData);
  },

  deleteImage: (public_id: string): Promise<any> =>
    api.delete('/upload/', { data: { public_id } }),
};