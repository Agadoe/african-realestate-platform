import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiSearch, FiMapPin, FiTrendingUp, FiHome, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { neighborhoodApi } from '../../lib/api';

interface Neighborhood {
  _id: string;
  name: string;
  description?: string;
  city: string;
  region: string;
  country: string;
  imageUrl?: string;
  averagePrice?: number;
  priceTrends?: string;
  totalListings?: number;
  popularity?: number;
  safetyRating?: number;
  amenities?: string[];
  priceRange?: { min: number; max: number };
}

interface NeighborhoodApiResponse {
  neighborhoods: Neighborhood[];
  total: number;
  page: number;
  pages: number;
}

export default function Neighborhoods() {
  const [searchQuery, setSearchQuery] = useState('');
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const loadNeighborhoods = async (pageNum = 1) => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, any> = { page: pageNum, limit: 12 };
      if (searchQuery) params.search = searchQuery;

      const response: { data: NeighborhoodApiResponse } = await neighborhoodApi.getNeighborhoods(params);
      setNeighborhoods(response.data.neighborhoods || []);
      setTotal(response.data.total || 0);
      setPage(response.data.page || 1);
      setPages(response.data.pages || 1);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load neighborhoods');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNeighborhoods(1);
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 1000000) return `GH₵${(price / 1000000).toFixed(1)}M`;
    if (price >= 1000) return `GH₵${(price / 1000).toFixed(0)}k`;
    return `GH₵${price.toLocaleString()}`;
  };

  const getTrendLabel = (trend?: string) => {
    switch (trend) {
      case 'rising': return { label: 'Rising', class: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30' };
      case 'stable': return { label: 'Stable', class: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30' };
      case 'declining': return { label: 'Declining', class: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30' };
      default: return { label: 'Unknown', class: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800' };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Head>
        <title>Neighborhoods | African Real Estate Platform</title>
        <meta name="description" content="Explore premium neighborhoods across Africa with market insights and property listings." />
      </Head>

      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Neighborhoods</h1>
              <p className="text-slate-600 dark:text-slate-400">
                {loading ? 'Loading...' : `Explore ${total} neighborhoods`}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search neighborhoods..."
                  className="pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white w-full md:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadNeighborhoods(1)}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
            {error} <button onClick={() => loadNeighborhoods(page)} className="underline ml-4">Retry</button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="h-48 bg-slate-200 dark:bg-slate-700" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : neighborhoods.length === 0 ? (
          <div className="text-center py-16">
            <FiMapPin className="mx-auto text-5xl text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No neighborhoods found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {searchQuery ? `No neighborhoods matching "${searchQuery}"` : 'No neighborhoods available'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {neighborhoods.map((hood, index) => {
              const trend = getTrendLabel(hood.priceTrends);
              return (
                <motion.div
                  key={hood._id}
                  className="card overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link href={`/neighborhoods/${hood._id}`} className="block">
                    <div className="h-48 bg-gradient-to-br from-slate-700 to-slate-900 relative overflow-hidden">
                      {hood.imageUrl ? (
                        <img src={hood.imageUrl} alt={hood.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-600 to-secondary-600">
                          <FiMapPin className="text-white text-4xl opacity-50" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${trend.class}`}>
                          {trend.label}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="p-6">
                    <Link href={`/neighborhoods/${hood._id}`} className="block">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 hover:text-primary-600 dark:hover:text-primary-400">
                        {hood.name}
                      </h3>
                      <div className="flex items-center text-slate-600 dark:text-slate-400 text-sm mb-3">
                        <FiMapPin className="w-4 h-4 mr-1" />
                        {[hood.city, hood.region, hood.country].filter(Boolean).join(', ')}
                      </div>
                    </Link>

                    {hood.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                        {hood.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-100 dark:border-slate-700">
                      {hood.averagePrice && (
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg. Price</p>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {formatPrice(hood.averagePrice)}
                          </p>
                        </div>
                      )}
                      {hood.totalListings !== undefined && (
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Listings</p>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {hood.totalListings}
                          </p>
                        </div>
                      )}
                      {hood.safetyRating && (
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Safety</p>
                          <div className="flex items-center">
                            <span className="font-semibold text-slate-900 dark:text-white mr-1">
                              {hood.safetyRating.toFixed(1)}
                            </span>
                            <span className="text-yellow-500 text-sm">★</span>
                          </div>
                        </div>
                      )}
                      {hood.popularity !== undefined && (
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Popularity</p>
                          <div className="flex items-center">
                            <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mr-2">
                              <div
                                className="h-full bg-primary-500 rounded-full"
                                style={{ width: `${Math.min(hood.popularity, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {hood.popularity}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Amenities */}
                    {(hood.amenities?.length ?? 0) > 0 && (
                      <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                        {hood.amenities!.slice(0, 3).map((amenity, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}

                    <Link
                      href={`/neighborhoods/${hood._id}`}
                      className="mt-4 flex items-center justify-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                    >
                      Explore Neighborhood <FiTrendingUp className="ml-1 w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && neighborhoods.length > 0 && (
          <div className="flex justify-center mt-12">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => { if (page > 1) loadNeighborhoods(page - 1); }}
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
                    onClick={() => loadNeighborhoods(pageNum)}
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
                onClick={() => { if (page < pages) loadNeighborhoods(page + 1); }}
                disabled={page >= pages}
                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                Next <FiChevronRight className="w-4 h-4 ml-1" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}