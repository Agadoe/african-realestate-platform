export interface Property {
  _id: string;
  title: string;
  description: string;
  propertyType: string;
  listingType: 'sale' | 'rent' | 'rent-to-own';
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  yearBuilt: number;
  condition: string;
  address: Address;
  features: string[];
  amenities: string[];
  images: Image[];
  videos: Video[];
  virtualTours: VirtualTour[];
  agentId: string | null;
  ownerId: string;
  neighborhoodId?: string;
  status: 'active' | 'pending' | 'sold' | 'rented' | 'withdrawn';
  listingScore: number;
  views: number;
  inquiries: number;
  seoMetadata?: {
    title: string;
    description: string;
    keywords: string[];
  };
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Image {
  url: string;
  caption?: string;
  isPrimary?: boolean;
}

export interface Video {
  url: string;
  caption?: string;
}

export interface VirtualTour {
  url: string;
  caption?: string;
}

export interface Address {
  street: string;
  city: string;
  region: string;
  country: string;
  postalCode?: string;
  coordinates?: {
    type?: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
}

export interface Agent {
  _id: string;
  userId: string;
  licenseNumber: string;
  agencyName: string;
  bio: string;
  commissionRate: number;
  responseTimeMinutes: number;
  rating: number;
  reviewCount: number;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  role: 'buyer' | 'agent' | 'admin' | 'owner';
  status: 'active' | 'inactive' | 'suspended';
  verified: boolean;
  verificationScore: number;
  preferences?: {
    preferredListingType?: 'sale' | 'rent' | 'rent-to-own';
    notificationPreferences?: {
      email?: boolean;
      sms?: boolean;
    };
  };
  favorites?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Inquiry {
  _id: string;
  propertyId: string;
  buyerId: string;
  agentId?: string;
  message: string;
  status: 'new' | 'contacted' | 'closed' | 'archived';
  responseTimeMinutes?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  _id: string;
  propertyId: string;
  buyerId: string;
  sellerId: string;
  agentId?: string;
  transactionType: 'sale' | 'rent' | 'rent-to-own';
  amount: number;
  currency: string;
  commissionAmount: number;
  commissionPercentage: number;
  status: 'pending' | 'escrow' | 'completed' | 'disputed' | 'cancelled';
  escrowId?: string;
  paymentMethod: string;
  createdAt: string;
  completedAt?: string;
  cancelledAt?: string;
}

export interface Escrow {
  _id: string;
  transactionId: string;
  amount: number;
  currency: string;
  buyerDeposit: number;
  agentCommission: number;
  releaseDate: string;
  status: 'pending' | 'funded' | 'released' | 'disputed' | 'cancelled';
  disputeReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  propertyId: string;
  reviewerId: string;
  agentId: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Neighborhood {
  _id: string;
  name: string;
  city: string;
  region: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
    bounds?: {
      northeast: { lat: number; lng: number };
      southwest: { lat: number; lng: number };
    };
  };
  description: string;
  amenities: string[];
  priceTrends: PriceTrend[];
  safetyScore: number;
  infrastructureScore: number;
  appreciationRate: number;
  seoMetadata?: {
    title: string;
    description: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface PriceTrend {
  year: number;
  averagePrice: number;
  priceChange: number;
}

export interface SearchQuery {
  _id: string;
  query: string;
  filters: Record<string, any>;
  userId?: string;
  resultsCount: number;
  searchTimeMs: number;
  createdAt: string;
}

export interface AIRecommendation {
  _id: string;
  userId: string;
  propertyId: string;
  score: number;
  reason: string;
  createdAt: string;
}