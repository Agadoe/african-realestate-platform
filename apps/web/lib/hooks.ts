import { useState, useEffect } from 'react';
import { propertyApi, analyticsApi, aiApi } from './api';

// Hook for managing property favorites
export const useFavorites = (userId?: string) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadFavorites();
    } else {
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        try {
          const favArray = JSON.parse(savedFavorites);
          setFavorites(new Set(favArray));
        } catch (e) {
          console.error('Failed to parse favorites from localStorage', e);
        }
      }
      setLoading(false);
    }
  }, [userId]);

  const loadFavorites = async () => {
    try {
      if (!userId) return;
      const response = await propertyApi.getFavorites(userId);
      setFavorites(new Set(response.data.map((fav: any) => fav._id)));
    } catch (error) {
      console.error('Failed to load favorites', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (propertyId: string) => {
    try {
      if (favorites.has(propertyId)) {
        if (userId) {
          await propertyApi.removeFavorite(userId, propertyId);
        }
        const newFavorites = new Set(favorites);
        newFavorites.delete(propertyId);
        setFavorites(newFavorites);
        if (!userId) {
          localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
        }
      } else {
        if (userId) {
          await propertyApi.addFavorite(userId, propertyId);
        }
        const newFavorites = new Set(favorites);
        newFavorites.add(propertyId);
        setFavorites(newFavorites);
        if (!userId) {
          localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
        }
      }
    } catch (error) {
      console.error('Failed to toggle favorite', error);
    }
  };

  const isFavorite = (propertyId: string) => favorites.has(propertyId);

  return {
    favorites: Array.from(favorites),
    isFavorite,
    toggleFavorite,
    loading,
  };
};

// Hook for property views tracking
export const usePropertyViews = () => {
  const [viewedProperties, setViewedProperties] = useState<Set<string>>(new Set());

  useEffect(() => {
    const savedViews = localStorage.getItem('viewedProperties');
    if (savedViews) {
      try {
        const viewsArray = JSON.parse(savedViews);
        setViewedProperties(new Set(viewsArray));
      } catch (e) {
        console.error('Failed to parse viewed properties from localStorage', e);
      }
    }
  }, []);

  const trackView = async (propertyId: string) => {
    try {
      const newViews = new Set(viewedProperties);
      newViews.add(propertyId);
      setViewedProperties(newViews);
      localStorage.setItem('viewedProperties', JSON.stringify(Array.from(newViews)));

      const userId = localStorage.getItem('userId');
      if (userId) {
        await analyticsApi.trackView(propertyId, userId);
      }
    } catch (error) {
      console.error('Failed to track property view', error);
    }
  };

  return {
    trackView,
    viewedProperties: Array.from(viewedProperties),
  };
};

// Hook for search functionality
export const useSearch = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState('newest');

  const performSearch = async (query: string) => {
    setLoading(true);
    try {
      const response = await propertyApi.searchProperties(query, { ...filters, sortBy });
      setSearchResults(response.data.properties);

      const userId = localStorage.getItem('userId');
      await analyticsApi.trackSearch({
        query,
        filters,
        userId,
        resultsCount: response.data.total,
      });
    } catch (error) {
      console.error('Search failed', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    searchResults,
    loading,
    filters,
    sortBy,
    performSearch,
    updateFilters: setFilters,
    updateSortBy: setSortBy,
  };
};

// Hook for AI recommendations
export const useRecommendations = (userId?: string) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRecommendations = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await aiApi.getRecommendations(userId);
      setRecommendations(response.data);
    } catch (error) {
      console.error('Failed to load recommendations', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) loadRecommendations();
  }, [userId]);

  return { recommendations, loading, refresh: loadRecommendations };
};

// Analytics hooks
export const useAnalytics = () => {
  const trackEvent = async (event: string, data?: Record<string, any>) => {
    try {
      await analyticsApi.trackConversion({ event, data, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('Failed to track event', error);
    }
  };

  const trackConversion = async (
    conversionType: string,
    value?: number,
    data?: Record<string, any>
  ) => {
    try {
      await analyticsApi.trackConversion({ conversionType, value, data, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('Failed to track conversion', error);
    }
  };

  return { trackEvent, trackConversion };
};

// Utility functions
export const formatCurrency = (amount: number, currency: string = 'GHS') =>
  new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

export const formatAddress = (address: any) =>
  address ? `${address.street}, ${address.city}` : '';

export const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });