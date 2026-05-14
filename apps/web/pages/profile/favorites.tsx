import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiHeart, FiHome, FiMapPin, FiChevronRight, FiX, FiFilter } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { propertyApi } from '../../lib/api';

interface Property {
  _id: string;
  title: string;
  price: number;
  currency: string;
  propertyType: string;
  listingType: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: string;
  status: string;
  images: Array<{ url: string }>;
  address: { city: string; region: string; country: string };
  agentId?: { firstName: string; lastName: string; rating?: number };
  ownerId?: { firstName: string; lastName: string };
}

export default function Favorites() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removing, setRemoving] = useState<string | null>(null);

  // Get user from localStorage
  const getUser = () => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  };

  // Get token
  const getToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  };

  useEffect(() => {
    const loadFavorites = async () => {
      const user = getUser();
      const token = getToken();

      if (!token) {
        // Load from localStorage for guests
        const saved = localStorage.getItem('favorites');
        if (saved) {
          try {
            const ids = JSON.parse(saved);
            setFavorites(ids);
            // Fetch property details for each ID
            await loadPropertiesForIds(ids);
          } catch {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
        return;
      }

      // Load from API for logged-in users
      try {
        const response: { data: any[] } = await propertyApi.getFavorites(user?._id || 'me');
        const ids = response.data.map((p: any) => p._id || p.propertyId?._id);
        setFavorites(ids);
        await loadPropertiesForIds(ids);
      } catch (err: any) {
        // Fallback to localStorage
        const saved = localStorage.getItem('favorites');
        if (saved) {
          const ids = JSON.parse(saved);
          setFavorites(ids);
          await loadPropertiesForIds(ids);
        } else {
          setError('Failed to load favorites');
        }
      }
    };

    loadFavorites();
  }, []);

  // Load properties for a list of IDs
  const loadPropertiesForIds = async (ids: string[]) => {
    if (ids.length === 0) {
      setProperties([]);
      setLoading(false);
      return;
    }

    try {
      const propertyPromises = ids.map((id: string) =>
        propertyApi.getProperty(id).catch(() => null)
      );
      const results = await Promise.all(propertyPromises);
      setProperties(results.filter(Boolean).map((r: any) => r.data));
    } catch (err) {
      console.error('Error loading properties:', err);
    } finally {
      setLoading(false);
    }
  };

  // Remove from favorites
  const handleRemove = async (propertyId: string) => {
    setRemoving(propertyId);
    try {
      const token = getToken();
      const user = getUser();

      if (token && user?._id) {
        await propertyApi.removeFavorite(user._id, propertyId);
      }

      // Update local state
      setFavorites(prev => prev.filter(id => id !== propertyId));
      setProperties(prev => prev.filter(p => p._id !== propertyId));

      // Update localStorage for guests
      if (!token) {
        const updated = favorites.filter(id => id !== propertyId);
        localStorage.setItem('favorites', JSON.stringify(updated));
      }
    } catch (err) {
      console.error('Error removing favorite:', err);
    } finally {
      setRemoving(null);
    }
  };

  // Format price
  const formatPrice = (price: number, currency: string) => {
    const symbol = currency === 'GHS' ? 'GH₵' : currency === 'USD' ? '$' : '€';
    if (price >= 1000000) return `${symbol}${(price / 1000000).toFixed(1)}M`;
    if (price >= 1000) return `${symbol}${(price / 1000).toFixed(0)}k`;
    return `${symbol}${price.toLocaleString()}`;
  };

  const getListingTypeLabel = (type: string) => {
    switch (type) {
      case 'sale': return 'For Sale';
      case 'rent': return 'For Rent';
      case 'rent-to-own': return 'Rent to Own';
      default: return type;
    }
  };

  const getPrimaryImage = (property: Property) => {
    if (property.images?.length > 0) return property.images[0].url;
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Favorites</h1>
            <p className="text-slate-600 dark:text-slate-400">Loading your saved properties...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="h-48 bg-slate-200 dark:bg-slate-700" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Head>
        <title>My Favorites | African Real Estate Platform</title>
        <meta name="description" content="Your saved favorite properties on the African Real Estate Platform" />
      </Head>

      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Favorites</h1>
          <p className="text-slate-600 dark:text-slate-400">
            {properties.length > 0
              ? `${properties.length} saved property${properties.length !== 1 ? 's' : ''}`
              : 'No saved properties yet'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        {/* Empty State */}
        {properties.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6">
              <FiHeart className="text-4xl text-slate-400" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
              No favorites yet
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
              Start exploring properties and save the ones you love by clicking the heart icon.
            </p>
            <Link href="/properties" className="btn btn-primary">
              Browse Properties
            </Link>
          </div>
        ) : (
          /* Favorites Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {properties.map((property, index) => {
                const primaryImage = getPrimaryImage(property);
                return (
                  <motion.div
                    key={property._id}
                    className="card overflow-hidden relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link href={`/properties/${property._id}`} className="block">
                      <div className="relative h-56">
                        {primaryImage ? (
                          <img
                            src={primaryImage}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                            <FiHome className="text-4xl text-slate-400" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-slate-900 dark:text-white">
                          {getListingTypeLabel(property.listingType)}
                        </div>
                      </div>
                    </Link>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemove(property._id)}
                      disabled={removing === property._id}
                      className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-slate-900/90 rounded-full hover:bg-white dark:hover:bg-slate-900 transition-colors z-10"
                      title="Remove from favorites"
                    >
                      {removing === property._id ? (
                        <svg className="animate-spin w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <FiHeart className="w-5 h-5 text-red-500 fill-current" />
                      )}
                    </button>

                    <div className="p-5">
                      <Link href={`/properties/${property._id}`} className="block">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400 line-clamp-1">
                          {property.title}
                        </h3>
                        <div className="flex items-center text-slate-600 dark:text-slate-400 text-sm mb-3">
                          <FiMapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span className="line-clamp-1">
                            {[property.address?.city, property.address?.region].filter(Boolean).join(', ')}
                          </span>
                        </div>
                      </Link>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                          {property.bedrooms > 0 && <span>{property.bedrooms} beds</span>}
                          {property.bathrooms > 0 && <span>{property.bathrooms} baths</span>}
                          <span>{property.area} {property.areaUnit || 'sqm'}</span>
                        </div>
                        <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                          {formatPrice(property.price, property.currency)}
                        </span>
                      </div>

                      {(property.agentId || property.ownerId) && (
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center">
                          <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-2">
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                              {(property.agentId || property.ownerId)?.firstName?.[0]}
                              {(property.agentId || property.ownerId)?.lastName?.[0]}
                            </span>
                          </div>
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {property.agentId
                              ? `${property.agentId.firstName} ${property.agentId.lastName}`
                              : `${property.ownerId?.firstName} ${property.ownerId?.lastName}`}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* CTA to browse more */}
        {properties.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Looking for more properties?
            </p>
            <Link href="/properties" className="btn btn-outline">
              Browse More Properties
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}