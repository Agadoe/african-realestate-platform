import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Heart,
  Home as HomeIcon,
  X,
  ChevronLeft,
  ChevronRight,
  Grid3x3,
  List,
  SlidersHorizontal,
  Check,
  Users,
  Bed,
  Bath,
} from 'lucide-react';
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
  const [backendWarmingUp, setBackendWarmingUp] = useState(false);

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

  const formatPrice = (price: number, currency: string) => {
    const symbol = currency === 'GHS' ? 'GH₵' : currency === 'USD' ? '$' : '€';
    if (price >= 1_000_000) return `${symbol}${(price / 1_000_000).toFixed(1)}M`;
    if (price >= 1_000) return `${symbol}${(price / 1_000).toFixed(0)}K`;
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
    if (property.images && property.images.length > 0) {
      return property.images[0].url;
    }
    return null;
  };

  // Load properties from API with 502 fallback
  const loadProperties = async (pageNum = 1) => {
    setLoading(true);
    setError('');
    setBackendWarmingUp(false);
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
      const status = err.response?.status;
      if (status === 502 || status === 503 || !err.response) {
        setBackendWarmingUp(true);
        setProperties([]);
        setTotal(0);
      } else {
        setError(err.response?.data?.error || 'Failed to load properties');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties(1);
  }, [filters, sortBy, order]);

  const toggleFavorite = (propertyId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(propertyId)) {
      newFavorites.delete(propertyId);
    } else {
      newFavorites.add(propertyId);
    }
    setFavorites(newFavorites);
  };

  const handleApplyFilters = () => {
    setShowFilters(false);
    loadProperties(1);
  };

  const handleResetFilters = () => {
    setFilters({ propertyType: '', listingType: '', minPrice: '', maxPrice: '', bedrooms: '', city: '' });
    setSearchQuery('');
    loadProperties(1);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-cream-50)' }}>
      <Head>
        <title>Explore Properties | Scervy Peak</title>
        <meta name="description" content="Browse premium property listings across Africa" />
      </Head>

      {/* Page Header */}
      <header style={{ background: 'var(--color-cream-50)', padding: '64px 0 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
          {/* Breadcrumb */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-charcoal-600)',
              marginBottom: 8,
            }}
          >
            Home / Properties
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                  fontWeight: 700,
                  color: 'var(--color-charcoal-950)',
                  letterSpacing: '-0.025em',
                  marginBottom: 8,
                }}
              >
                Explore Properties
              </h1>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-lg)', color: 'var(--color-charcoal-600)' }}>
                {loading ? 'Loading...' : `${total.toLocaleString()} properties found`}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Sticky Filter Bar */}
      <div
        style={{
          background: 'var(--color-white)',
          boxShadow: 'var(--shadow-sm)',
          padding: '16px 0',
          position: 'sticky',
          top: 72,
          zIndex: 30,
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0 32px',
            display: 'flex',
            gap: 12,
            alignItems: 'center',
          }}
        >
          {/* Search Input */}
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)',
                pointerEvents: 'none',
              }}
              strokeWidth={1.5}
            />
            <input
              type="text"
              placeholder="Search properties..."
              className="input"
              style={{ paddingLeft: 48, minHeight: 44 }}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  setFilters(prev => ({ ...prev, city: searchQuery }));
                  loadProperties(1);
                }
              }}
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-cream-200)',
              background: 'transparent',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: 'var(--color-charcoal-700)',
              transition: 'background 200ms',
            }}
            className="md:hidden"
          >
            <SlidersHorizontal size={16} strokeWidth={1.5} />
            Filters
          </button>

          {/* Grid/List Toggle */}
          <div
            style={{
              display: 'flex',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-cream-200)',
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '10px 14px',
                border: 'none',
                background: viewMode === 'grid' ? 'var(--color-forest-600)' : 'transparent',
                color: viewMode === 'grid' ? '#fff' : 'var(--color-charcoal-700)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                transition: 'background 200ms',
              }}
              aria-label="Grid view"
            >
              <Grid3x3 size={18} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '10px 14px',
                border: 'none',
                background: viewMode === 'list' ? 'var(--color-forest-600)' : 'transparent',
                color: viewMode === 'list' ? '#fff' : 'var(--color-charcoal-700)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                transition: 'background 200ms',
              }}
              aria-label="List view"
            >
              <List size={18} strokeWidth={1.5} />
            </button>
          </div>

          {/* Sort */}
          <select
            className="input"
            style={{ width: 'auto', minHeight: 44 }}
            value={`${sortBy}-${order}`}
            onChange={e => {
              const [s, o] = e.target.value.split('-');
              setSortBy(s);
              setOrder(o);
            }}
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 32px 96px' }}>
        <div style={{ display: 'flex', gap: 32 }}>
          {/* Filter Sidebar */}
          <aside
            style={{
              width: 280,
              flexShrink: 0,
            }}
            className={`hidden lg:block`}
          >
            <div
              style={{
                background: 'var(--color-white)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)',
                padding: 24,
                position: 'sticky',
                top: 140,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-xl)',
                    fontWeight: 600,
                    color: 'var(--color-charcoal-950)',
                  }}
                >
                  Filters
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'none',
                  }}
                  className="lg:hidden"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Listing Type */}
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: 'var(--color-charcoal-950)',
                      marginBottom: 12,
                    }}
                  >
                    Listing Type
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {['', 'sale', 'rent', 'rent-to-own'].map(option => (
                      <label
                        key={option || 'all'}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                      >
                        <div
                          onClick={() => setFilters(prev => ({ ...prev, listingType: option }))}
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            border: `2px solid ${filters.listingType === option ? 'var(--color-forest-600)' : 'var(--color-cream-200)'}`,
                            background: filters.listingType === option ? 'var(--color-forest-600)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 200ms',
                            flexShrink: 0,
                          }}
                        >
                          {filters.listingType === option && (
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />
                          )}
                        </div>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-charcoal-700)' }}>
                          {option === '' ? 'All' : option === 'sale' ? 'For Sale' : option === 'rent' ? 'For Rent' : 'Rent to Own'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: 'var(--color-charcoal-950)',
                      marginBottom: 12,
                    }}
                  >
                    Property Type
                  </h3>
                  <select
                    className="input"
                    value={filters.propertyType}
                    onChange={e => setFilters(prev => ({ ...prev, propertyType: e.target.value }))}
                    style={{ minHeight: 44 }}
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
                  <h3
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: 'var(--color-charcoal-950)',
                      marginBottom: 12,
                    }}
                  >
                    Price Range
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <input
                      type="number"
                      placeholder="Min (GHS)"
                      className="input"
                      value={filters.minPrice}
                      onChange={e => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                      style={{ minHeight: 44 }}
                    />
                    <input
                      type="number"
                      placeholder="Max (GHS)"
                      className="input"
                      value={filters.maxPrice}
                      onChange={e => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                      style={{ minHeight: 44 }}
                    />
                  </div>
                </div>

                {/* Bedrooms */}
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: 'var(--color-charcoal-950)',
                      marginBottom: 12,
                    }}
                  >
                    Bedrooms
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {['', '1', '2', '3', '4', '5+'].map(bed => (
                      <button
                        key={bed || 'any'}
                        onClick={() => setFilters(prev => ({ ...prev, bedrooms: bed }))}
                        style={{
                          padding: '8px 16px',
                          borderRadius: 'var(--radius-md)',
                          border: `1px solid ${filters.bedrooms === bed ? 'var(--color-forest-600)' : 'var(--color-cream-200)'}`,
                          background: filters.bedrooms === bed ? 'var(--color-forest-600)' : 'transparent',
                          color: filters.bedrooms === bed ? '#fff' : 'var(--color-charcoal-700)',
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 200ms',
                        }}
                      >
                        {bed || 'Any'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* City */}
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: 'var(--color-charcoal-950)',
                      marginBottom: 12,
                    }}
                  >
                    City
                  </h3>
                  <input
                    type="text"
                    placeholder="e.g. Accra"
                    className="input"
                    value={filters.city}
                    onChange={e => setFilters(prev => ({ ...prev, city: e.target.value }))}
                    style={{ minHeight: 44 }}
                  />
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button
                    onClick={handleApplyFilters}
                    className="btn btn-primary btn-md"
                    style={{ width: '100%' }}
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={handleResetFilters}
                    className="btn btn-ghost btn-md"
                    style={{ width: '100%' }}
                  >
                    Reset All
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main style={{ flex: 1 }}>
            {/* Error */}
            {error && (
              <div
                style={{
                  padding: 16,
                  background: 'var(--color-error-bg)',
                  color: 'var(--color-error)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 24,
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                {error}
                <button
                  onClick={() => loadProperties(page)}
                  style={{ marginLeft: 16, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
                >
                  Retry
                </button>
              </div>
            )}

            {/* Backend Warming Up */}
            {backendWarmingUp && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '80px 0',
                  fontFamily: 'var(--font-body)',
                }}
              >
                <p
                  style={{
                    fontSize: 'var(--text-lg)',
                    color: 'var(--color-charcoal-600)',
                    marginBottom: 8,
                  }}
                >
                  Backend warming up — properties loading shortly
                </p>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal-500)' }}>
                  The server is spinning up after inactivity. Please wait a moment.
                </p>
              </div>
            )}

            {/* Loading */}
            {loading && !backendWarmingUp && (
              <div
                style={{
                  display: viewMode === 'grid' ? 'grid' : 'flex',
                  gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : undefined,
                  flexDirection: viewMode === 'list' ? 'column' : undefined,
                  gap: 24,
                }}
              >
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div
                    key={i}
                    style={{
                      background: 'var(--color-white)',
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div className="skeleton" style={{ height: viewMode === 'grid' ? 260 : 200 }} />
                    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div className="skeleton" style={{ height: 24, width: '75%', borderRadius: 8 }} />
                      <div className="skeleton" style={{ height: 16, width: '50%', borderRadius: 8 }} />
                      <div className="skeleton" style={{ height: 16, width: '40%', borderRadius: 8 }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !backendWarmingUp && properties.length === 0 && !error && (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'var(--color-cream-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                  }}
                >
                  <HomeIcon size={40} strokeWidth={1.5} style={{ color: 'var(--color-charcoal-400)' }} />
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-xl)',
                    fontWeight: 600,
                    color: 'var(--color-charcoal-950)',
                    marginBottom: 8,
                  }}
                >
                  No properties found
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-base)',
                    color: 'var(--color-charcoal-600)',
                    marginBottom: 24,
                  }}
                >
                  Try adjusting your filters or search criteria
                </p>
                <button onClick={handleResetFilters} className="btn btn-primary btn-md">
                  Clear Filters
                </button>
              </div>
            )}

            {/* Results */}
            {!loading && !backendWarmingUp && properties.length > 0 && (
              <>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-charcoal-600)',
                    marginBottom: 24,
                  }}
                >
                  Showing {properties.length} of {total.toLocaleString()} properties
                </p>

                <div
                  style={{
                    display: viewMode === 'grid' ? 'grid' : 'flex',
                    gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : undefined,
                    flexDirection: viewMode === 'list' ? 'column' : undefined,
                    gap: 24,
                  }}
                >
                  {properties.map((property, index) => {
                    const primaryImage = getPrimaryImage(property);
                    const isFav = favorites.has(property._id);

                    return (
                      <div
                        key={property._id}
                        style={{
                          background: 'var(--color-white)',
                          borderRadius: 'var(--radius-lg)',
                          overflow: viewMode === 'list' ? 'hidden' : 'hidden',
                          boxShadow: 'var(--shadow-sm)',
                          display: viewMode === 'list' ? 'flex' : 'block',
                          animation: `fadeInUp 0.4s ease-out ${index * 60}ms both`,
                          transition: 'transform 300ms ease, box-shadow 300ms ease',
                        }}
                        className="property-list-card"
                      >
                        <Link
                          href={`/properties/${property._id}`}
                          style={{ display: 'block', flexShrink: 0 }}
                        >
                          <div
                            style={{
                              position: 'relative',
                              height: viewMode === 'grid' ? 260 : '100%',
                              minHeight: viewMode === 'list' ? 200 : 260,
                              overflow: 'hidden',
                            }}
                          >
                            {primaryImage ? (
                              <img
                                src={primaryImage}
                                alt={property.title}
                                style={{
                                  width: viewMode === 'list' ? 280 : '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                }}
                                onError={e => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: viewMode === 'list' ? 280 : '100%',
                                  height: '100%',
                                  minHeight: viewMode === 'list' ? 200 : 260,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: 'var(--color-cream-200)',
                                }}
                              >
                                <HomeIcon size={40} strokeWidth={1.5} style={{ color: 'var(--color-charcoal-400)' }} />
                              </div>
                            )}

                            {/* Favorite */}
                            <button
                              onClick={e => {
                                e.preventDefault();
                                toggleFavorite(property._id);
                              }}
                              style={{
                                position: 'absolute',
                                top: 16,
                                right: 16,
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.9)',
                                backdropFilter: 'blur(8px)',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: isFav ? 'var(--color-gold-500)' : 'var(--color-charcoal-700)',
                              }}
                              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                            >
                              <Heart size={18} strokeWidth={1.5} style={{ fill: isFav ? 'currentColor' : 'none' }} />
                            </button>

                            {/* Listing Type Badge */}
                            <div
                              style={{
                                position: 'absolute',
                                bottom: 16,
                                left: 16,
                                background: 'rgba(255,255,255,0.9)',
                                backdropFilter: 'blur(8px)',
                                padding: '6px 14px',
                                borderRadius: 'var(--radius-full)',
                                fontFamily: 'var(--font-body)',
                                fontSize: 'var(--text-xs)',
                                fontWeight: 600,
                                color: 'var(--color-charcoal-950)',
                              }}
                            >
                              {getListingTypeLabel(property.listingType)}
                            </div>
                          </div>
                        </Link>

                        <div
                          style={{
                            padding: 24,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12,
                            flex: 1,
                          }}
                        >
                          <Link href={`/properties/${property._id}`} style={{ textDecoration: 'none' }}>
                            <h3
                              style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'var(--text-lg)',
                                fontWeight: 600,
                                color: 'var(--color-charcoal-950)',
                                marginBottom: 4,
                                transition: 'color 200ms',
                              }}
                            >
                              {property.title}
                            </h3>
                          </Link>

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              fontSize: 'var(--text-sm)',
                              color: 'var(--color-charcoal-600)',
                            }}
                          >
                            <MapPin size={14} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                            <span style={{ fontFamily: 'var(--font-body)' }}>
                              {[property.address?.city, property.address?.region].filter(Boolean).join(', ')}
                            </span>
                          </div>

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '12px 0',
                              borderTop: '1px solid var(--color-cream-200)',
                              borderBottom: '1px solid var(--color-cream-200)',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 'var(--text-sm)', color: 'var(--color-charcoal-600)' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Bed size={14} strokeWidth={1.5} />
                                {property.bedrooms} beds
                              </span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Bath size={14} strokeWidth={1.5} />
                                {property.bathrooms} baths
                              </span>
                              <span>{property.area} {property.areaUnit || 'sqm'}</span>
                            </div>
                            <span
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: 'var(--text-lg)',
                                fontWeight: 700,
                                color: 'var(--color-forest-600)',
                              }}
                            >
                              {formatPrice(property.price, property.currency)}
                              {property.listingType === 'rent' && (
                                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 400, color: 'var(--color-charcoal-600)' }}>/mo</span>
                              )}
                            </span>
                          </div>

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              paddingTop: 4,
                            }}
                          >
                            {(property.agentId) ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div
                                  style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    background: 'var(--color-forest-100)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: 'var(--text-xs)',
                                    fontWeight: 700,
                                    color: 'var(--color-forest-700)',
                                  }}
                                >
                                  {property.agentId.firstName?.[0]}{property.agentId.lastName?.[0]}
                                </div>
                                <div>
                                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-charcoal-950)' }}>
                                    {property.agentId.firstName} {property.agentId.lastName}
                                  </p>
                                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-600)' }}>Verified Agent</p>
                                </div>
                              </div>
                            ) : property.ownerId ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div
                                  style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    background: 'var(--color-cream-200)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: 'var(--text-xs)',
                                    fontWeight: 700,
                                    color: 'var(--color-charcoal-700)',
                                  }}
                                >
                                  {property.ownerId.firstName?.[0]}{property.ownerId.lastName?.[0]}
                                </div>
                                <div>
                                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-charcoal-950)' }}>
                                    {property.ownerId.firstName} {property.ownerId.lastName}
                                  </p>
                                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-600)' }}>Property Owner</p>
                                </div>
                              </div>
                            ) : <div />}

                            <Link
                              href={`/properties/${property._id}`}
                              className="btn btn-primary btn-sm"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 48, gap: 8 }}>
                  <button
                    onClick={() => { if (page > 1) loadProperties(page - 1); }}
                    disabled={page <= 1}
                    style={{
                      padding: '10px 20px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-cream-200)',
                      background: 'transparent',
                      color: page <= 1 ? 'var(--color-charcoal-500)' : 'var(--color-charcoal-700)',
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 500,
                      cursor: page <= 1 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      opacity: page <= 1 ? 0.5 : 1,
                    }}
                  >
                    <ChevronLeft size={16} strokeWidth={1.5} />
                    Previous
                  </button>

                  {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => loadProperties(pageNum)}
                        style={{
                          padding: '10px 16px',
                          borderRadius: 'var(--radius-md)',
                          border: 'none',
                          background: page === pageNum ? 'var(--color-forest-600)' : 'transparent',
                          color: page === pageNum ? '#fff' : 'var(--color-charcoal-700)',
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'background 200ms',
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => { if (page < pages) loadProperties(page + 1); }}
                    disabled={page >= pages}
                    style={{
                      padding: '10px 20px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-cream-200)',
                      background: 'transparent',
                      color: page >= pages ? 'var(--color-charcoal-500)' : 'var(--color-charcoal-700)',
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 500,
                      cursor: page >= pages ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      opacity: page >= pages ? 0.5 : 1,
                    }}
                  >
                    Next
                    <ChevronRight size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .property-list-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
      `}</style>
    </div>
  );
}