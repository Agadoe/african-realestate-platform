import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiSearch, FiMapPin, FiStar, FiPhone, FiMail, FiFilter, FiChevronLeft, FiChevronRight, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { agentApi } from '../../lib/api';

interface Agent {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  agencyName?: string;
  rating?: number;
  reviewCount?: number;
  responseTime?: string;
  propertiesSold?: number;
  commissionRate?: number;
  specialties?: string[];
  verificationStatus?: string;
  bio?: string;
  location?: string;
  profileImage?: string;
}

interface AgentApiResponse {
  agents: Agent[];
  total: number;
  page: number;
  pages: number;
}

export default function Agents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const loadAgents = async (pageNum = 1) => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, any> = { page: pageNum, limit: 12 };
      if (searchQuery) params.search = searchQuery;

      const response: { data: AgentApiResponse } = await agentApi.getAgents(params);
      setAgents(response.data.agents || []);
      setTotal(response.data.total || 0);
      setPage(response.data.page || 1);
      setPages(response.data.pages || 1);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgents(1);
  }, []);

  const handleSearch = () => {
    loadAgents(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Head>
        <title>Real Estate Agents | African Real Estate Platform</title>
        <meta name="description" content="Find verified real estate agents across Africa" />
      </Head>

      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Real Estate Agents</h1>
              <p className="text-slate-600 dark:text-slate-400">
                {loading ? 'Loading...' : `${total} verified agents found`}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search agents..."
                  className="pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white w-full md:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <FiFilter className="text-slate-700 dark:text-slate-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
            {error} <button onClick={() => loadAgents(page)} className="underline ml-4">Retry</button>
          </div>
        )}

        {loading ? (
          /* Loading Skeleton */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 mr-4" />
                  <div className="space-y-2 flex-1">
                    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : agents.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <FiSearch className="text-3xl text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No agents found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {searchQuery ? `No agents matching "${searchQuery}"` : 'No agents available at the moment'}
            </p>
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); loadAgents(1); }}
                className="btn btn-primary"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          /* Agents Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent, index) => (
              <motion.div
                key={agent._id}
                className="card overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    {agent.profileImage ? (
                      <img
                        src={agent.profileImage}
                        alt={`${agent.firstName} ${agent.lastName}`}
                        className="w-16 h-16 rounded-full mr-4 object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4">
                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          {agent.firstName?.[0]}{agent.lastName?.[0]}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {agent.firstName} {agent.lastName}
                        </h3>
                        {agent.verificationStatus === 'verified' && (
                          <span className="text-blue-500" title="Verified Agent">
                            <FiCheck className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                      {agent.agencyName && (
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                          {agent.agencyName}
                        </p>
                      )}
                      {agent.location && (
                        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-1">
                          <FiMapPin className="w-3 h-3 mr-1" />
                          {agent.location}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rating */}
                  {typeof agent.rating === 'number' && (
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400 mr-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <FiStar
                            key={i}
                            className={`w-4 h-4 ${i <= Math.round(agent.rating!) ? 'fill-current' : ''}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {agent.rating.toFixed(1)} ({agent.reviewCount || 0} reviews)
                      </span>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="mb-4 space-y-2">
                    {agent.responseTime && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Response Time</span>
                        <span className="font-medium text-slate-900 dark:text-white">{agent.responseTime}</span>
                      </div>
                    )}
                    {agent.propertiesSold !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Properties Sold</span>
                        <span className="font-medium text-slate-900 dark:text-white">{agent.propertiesSold}</span>
                      </div>
                    )}
                    {agent.commissionRate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Commission Rate</span>
                        <span className="font-medium text-slate-900 dark:text-white">{agent.commissionRate}%</span>
                      </div>
                    )}
                  </div>

                  {/* Specialties */}
                  {(agent.specialties?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {agent.specialties!.slice(0, 3).map((specialty, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Bio */}
                  {agent.bio && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                      {agent.bio}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2">
                    {agent.phone && (
                      <a
                        href={`tel:${agent.phone}`}
                        className="flex-1 flex items-center justify-center p-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-sm text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        <FiPhone className="mr-1" /> Call
                      </a>
                    )}
                    {agent.email && (
                      <a
                        href={`mailto:${agent.email}`}
                        className="flex-1 flex items-center justify-center p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm transition-colors"
                      >
                        <FiMail className="mr-1" /> Message
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && agents.length > 0 && (
          <div className="flex justify-center mt-12">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => { if (page > 1) loadAgents(page - 1); }}
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
                    onClick={() => loadAgents(pageNum)}
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
                onClick={() => { if (page < pages) loadAgents(page + 1); }}
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