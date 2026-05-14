import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiFilter, FiMapPin, FiHeart, FiGrid, FiList, FiSearch, FiHome, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
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
  images: Array<{ url: string; caption?: string }>;
  address: { city: string; region: string; country: string };
  agentId?: { firstName: string; lastName: string; rating?: number };
  ownerId?: { firstName: string; lastName: string };
}

interface PropertyApiResponse {
  properties: Property[];
  total: number;
  page: number;
  pages: number;
}

export default function Properties() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // Filter state
  const [filters, setFilters] = useState({
    propertyType: '',
    listingType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    city: '',
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const limit = 12;

  // Load properties from API
  const loadProperties = async (pageNum = 1) => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, any> = {
        page: pageNum,
        limit,
        sortBy,
        order,
      };
      if (filters.propertyType) params.propertyType = filters.propertyType;
      if (filters.listingType) params.listingType = filters.listingType;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.bedrooms) params.bedrooms = filters.bedrooms;
      if (filters.city) params.city = filters.city;

      const response: { data: PropertyApiResponse } = await propertyApi.getProperties(params);
      setProperties(response.data.properties || []);
      setTotal(response.data.total || 0);
      setPage(response.data.page || 1);
      setPages(response.data.pages || 1);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load properties');
      console.error('Error loading properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties(1);
  }, [filters, sortBy, order]);

  // Toggle favorite
  const toggleFavorite = async (propertyId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(propertyId)) {
      newFavorites.delete(propertyId);
    } else {
      newFavorites.add(propertyId);
      // TODO: Call API to save favorite for logged-in user
    }
    setFavorites(newFavorites);
  };

  // Apply filters
  const handleApplyFilters = () => {
    setShowFilters(false);
    loadProperties(1);
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({ propertyType: '', listingType: '', minPrice: '', maxPrice: '', bedrooms: '', city: '' });
    setSearchQuery('');
    loadProperties(1);
  };

  // Format price
  const formatPrice = (price: number, currency: string) => {
    const symbol = currency === 'GHS' ? 'GH₵' : currency === 'USD' ? '$' : '€';
    return `${symbol}${(price / 1000).toFixed(price >= 100000 ? 0 : 1)}k`;
  };

  // Get listing type label
  const getListingTypeLabel = (type: string) => {
    switch (type) {
      case 'sale': return 'For Sale';
      case 'rent': return 'For Rent';
      case 'rent-to-own': return 'Rent to Own';
      default: return type;
    }
  };

  // Get primary image
  const getPrimaryImage = (property: Property) => {
    if (property.images && property.images.length > 0) {
      return property.images[0].url;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Head>
        <title>Properties | African Real Estate Platform</title>
        <meta name="description" content="Browse premium property listings across Africa" />
      </Head>

      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Properties</h1>
              <p className="text-slate-600 dark:text-slate-400">
                {loading ? 'Loading...' : `${total} properties found`}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  className="pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white w-full md:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setFilters(prev => ({ ...prev, city: searchQuery }));
                      loadProperties(1);
                    }
                  }}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 md:hidden"
              >
                <FiFilter className="text-slate-700 dark:text-slate-300" />
              </button>
              <div className="hidden md:flex border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden">
                <button
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <FiGrid />
                </button>
                <button
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'}`}
                  onClick={() => setViewMode('list')}
                >
                  <FiList />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`w-full lg:w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="card p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 lg:hidden"
                >
                  <FiX className="text-slate-500" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Listing Type */}
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white mb-3">Listing Type</h3>
                  <div className="space-y-2">
                    {[
                      { value: '', label: 'All' },
                      { value: 'sale', label: 'For Sale' },
                      { value: 'rent', label: 'For Rent' },
                      { value: 'rent-to-own', label: 'Rent to Own' },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="listingType"
                          value={option.value}
                          checked={filters.listingType === option.value}
                          onChange={(e) => setFilters(prev => ({ ...prev, listingType: e.target.value }))}
                          className="mr-2"
                        />
                        <span className="text-slate-700 dark:text-slate-300">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white mb-3">Property Type</h3>
                  <select
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    value={filters.propertyType}
                    onChange={(e) => setFilters(prev => ({ ...prev, propertyType: e.target.value }))}
                  >
                    <option value="">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="land">Land</option>
                    <option value="commercial">Commercial</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="townhouse">Townhouse</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white mb-3">Price Range</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-slate-600 dark:text-slate-400">Min Price (GHS)</label>
                      <input
                        type="number"
                        placeholder="e.g. 50000"
                        className="w-full mt-1 p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        value={filters.minPrice}
                        onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-slate-600 dark:text-slate-400">Max Price (GHS)</label>
                      <input
                        type="number"
                        placeholder="e.g. 500000"
                        className="w-full mt-1 p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Bedrooms */}
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white mb-3">Bedrooms</h3>
                  <div className="flex flex-wrap gap-2">
                    {['', '1', '2', '3', '4', '5'].map((bed) => (
                      <button
                        key={bed || 'any'}
                        onClick={() => setFilters(prev => ({ ...prev, bedrooms: bed }))}
                        className={`px-3 py-1 text-sm border rounded-lg transition-colors ${
                          filters.bedrooms === bed
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {bed || 'Any'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* City */}
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white mb-3">City</h3>
                  <input
                    type="text"
                    placeholder="e.g. Accra"
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    value={filters.city}
                    onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleApplyFilters}
                    className="w-full btn btn-primary"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={handleResetFilters}
                    className="w-full btn btn-outline text-sm"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Properties Grid/List */}
          <main className="flex-1">
            {/* Sort Controls */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-slate-600 dark:text-slate-400">
                {loading ? 'Loading...' : `Showing ${properties.length} of ${total} properties`}
              </p>
              <select
                className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                value={`${sortBy}-${order}`}
                onChange={(e) => {
                  const [s, o] = e.target.value.split('-');
                  setSortBy(s);
                  setOrder(o);
                }}
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="listingScore-desc">Top Rated</option>
              </select>
            </div>

            {/* Error State */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
                {error}
                <button onClick={() => loadProperties(page)} className="ml-4 underline">Retry</button>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="card overflow-hidden animate-pulse">
                    <div className="h-64 bg-slate-200 dark:bg-slate-700" />
                    <div className="p-6 space-y-3">
                      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              /* Empty State */
              <div className="text-center py-16">
                <FiHome className="mx-auto text-5xl text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  No properties found
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <button onClick={handleResetFilters} className="btn btn-primary">
                  Clear Filters
                </button>
              </div>
            ) : (
              /* Properties List */
              <AnimatePresence>
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-6'}>
                  {properties.map((property, index) => {
                    const primaryImage = getPrimaryImage(property);
                    return (
                      <motion.div
                        key={property._id}
                        className={viewMode === 'grid' ? 'card overflow-hidden' : 'card md:flex'}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Link href={`/properties/${property._id}`} className="block">
                          <div className={viewMode === 'grid' ? 'relative h-64' : 'md:w-80 h-64 md:h-auto relative'}>
                            {primaryImage ? (
                              <img
                                src={primaryImage}
                                alt={property.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="bg-slate-200 dark:bg-slate-700 w-full h-full flex items-center justify-center">
                                <FiHome className="text-slate-400 text-4xl" />
                              </div>
                            )}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                toggleFavorite(property._id);
                              }}
                              className="absolute top-4 right-4 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 transition-colors duration-200"
                            >
                              <FiHeart
                                className={`w-5 h-5 ${favorites.has(property._id) ? 'text-red-500 fill-current' : 'text-slate-700 dark:text-slate-300'}`}
                              />
                            </button>
                            <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-slate-900 dark:text-white">
                              {getListingTypeLabel(property.listingType)}
                            </div>
                          </div>
                        </Link>

                        <div className={viewMode === 'grid' ? 'p-6' : 'p-6 md:flex-1'}>
                          <Link href={`/properties/${property._id}`} className="block">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-lg font-semibold text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400">
                                {property.title}
                              </h3>
                              <span className="text-xs font-medium px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full capitalize">
                                {property.status}
                              </span>
                            </div>

                            <div className="flex items-center text-slate-600 dark:text-slate-400 mb-3">
                              <FiMapPin className="mr-2 flex-shrink-0" />
                              <span className="line-clamp-1">
                                {[property.address?.city, property.address?.region, property.address?.country].filter(Boolean).join(', ')}
                              </span>
                            </div>

                            <div className="flex items-center justify-between mb-4">
                              <div className="flex space-x-4 text-sm text-slate-600 dark:text-slate-400">
                                {property.bedrooms > 0 && <span>{property.bedrooms} beds</span>}
                                {property.bathrooms > 0 && <span>{property.bathrooms} baths</span>}
                                <span>{property.area} {property.areaUnit || 'sqm'}</span>
                              </div>
                              <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                                {formatPrice(property.price, property.currency)} {property.listingType === 'rent' ? '/mo' : ''}
                              </span>
                            </div>
                          </Link>

                          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-4">
                            {(property.agentId) ? (
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-2">
                                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                    {property.agentId.rating?.toFixed(1) || '—'}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                                    {property.agentId.firstName} {property.agentId.lastName}
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">Verified Agent</p>
                                </div>
                              </div>
                            ) : property.ownerId ? (
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-2">
                                  <span className="text-xs font-bold text-green-600 dark:text-green-400">O</span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                                    {property.ownerId.firstName} {property.ownerId.lastName}
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">Property Owner</p>
                                </div>
                              </div>
                            ) : null}

                            <Link
                              href={`/properties/${property._id}`}
                              className="btn btn-primary text-sm px-4 py-2"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </AnimatePresence>
            )}

            {/* Pagination */}
            {!loading && properties.length > 0 && (
              <div className="flex justify-center mt-12">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      if (page > 1) loadProperties(page - 1);
                    }}
                    disabled={page <= 1}
                    className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <FiChevronLeft className="w-4 h-4 mr-1" /> Previous
                  </button>
                  {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => loadProperties(pageNum)}
                        className={`px-4 py-2 rounded-lg ${
                          page === pageNum
                            ? 'bg-primary-600 text-white'
                            : 'border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => {
                      if (page < pages) loadProperties(page + 1);
                    }}
                    disabled={page >= pages}
                    className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    Next <FiChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </nav>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}