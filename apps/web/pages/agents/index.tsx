import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Star,
  Phone,
  Mail,
  Filter,
  ChevronLeft,
  ChevronRight,
  Check,
  Home as HomeIcon,
} from 'lucide-react';
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
  const [backendWarmingUp, setBackendWarmingUp] = useState(false);
  const [specialtyFilter, setSpecialtyFilter] = useState('');

  const loadAgents = async (pageNum = 1) => {
    setLoading(true);
    setError('');
    setBackendWarmingUp(false);
    try {
      const params: Record<string, any> = { page: pageNum, limit: 12 };
      if (searchQuery) params.search = searchQuery;
      if (specialtyFilter) params.specialty = specialtyFilter;

      const response: { data: AgentApiResponse } = await agentApi.getAgents(params);
      setAgents(response.data.agents || []);
      setTotal(response.data.total || 0);
      setPage(response.data.page || 1);
      setPages(response.data.pages || 1);
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 502 || status === 503 || !err.response) {
        setBackendWarmingUp(true);
        setAgents([]);
        setTotal(0);
      } else {
        setError(err.response?.data?.error || 'Failed to load agents');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgents(1);
  }, [specialtyFilter]);

  const handleSearch = () => {
    loadAgents(1);
  };

  const specialtyOptions = [
    { value: '', label: 'All Specialties' },
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'luxury', label: 'Luxury' },
    { value: 'land', label: 'Land' },
    { value: 'investment', label: 'Investment' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-cream-50)' }}>
      <Head>
        <title>Our Agents | Scervy Peak</title>
        <meta name="description" content="Meet verified real estate agents across Africa" />
      </Head>

      {/* Page Header — dark forest background per spec */}
      <header
        style={{
          background: 'var(--color-forest-900)',
          padding: '80px 0 48px',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-gold-400)',
              marginBottom: 16,
            }}
          >
            Real Estate Professionals
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                  fontWeight: 700,
                  color: '#fff',
                  letterSpacing: '-0.025em',
                  marginBottom: 12,
                }}
              >
                Meet Our Verified Agents
              </h1>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-lg)',
                  color: 'var(--color-cream-200)',
                }}
              >
                {loading ? 'Loading...' : `${total} verified agents`}
              </p>
            </div>

            {/* Agent count gold pill */}
            {!loading && total > 0 && (
              <div
                style={{
                  padding: '8px 20px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-gold-600)',
                  color: '#fff',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 700,
                }}
              >
                {total} Agents
              </div>
            )}
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
            flexWrap: 'wrap',
          }}
        >
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
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
              placeholder="Search agents by name, location, or specialty..."
              className="input"
              style={{ paddingLeft: 48, minHeight: 44 }}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
          </div>

          {/* Specialty Filter */}
          <select
            className="input"
            style={{ width: 'auto', minHeight: 44, minWidth: 180 }}
            value={specialtyFilter}
            onChange={e => setSpecialtyFilter(e.target.value)}
          >
            {specialtyOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 32px 96px' }}>
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
              onClick={() => loadAgents(page)}
              style={{
                marginLeft: 16,
                textDecoration: 'underline',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'inherit',
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Backend Warming Up */}
        {backendWarmingUp && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-lg)',
                color: 'var(--color-charcoal-600)',
              }}
            >
              Backend warming up — agents loading shortly
            </p>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && !backendWarmingUp && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: 24,
            }}
          >
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={i}
                style={{
                  background: 'var(--color-white)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 24,
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                  <div className="skeleton" style={{ width: 80, height: 80, borderRadius: '50%', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ height: 20, width: '60%', borderRadius: 6, marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 14, width: '40%', borderRadius: 6 }} />
                  </div>
                </div>
                <div className="skeleton" style={{ height: 14, width: '80%', borderRadius: 6, marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 14, width: '60%', borderRadius: 6 }} />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !backendWarmingUp && agents.length === 0 && !error && (
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
              <Search size={40} strokeWidth={1.5} style={{ color: 'var(--color-charcoal-400)' }} />
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
              No agents found
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                color: 'var(--color-charcoal-600)',
                marginBottom: 24,
              }}
            >
              {searchQuery
                ? `No agents matching "${searchQuery}"`
                : 'No agents available at the moment'}
            </p>
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); loadAgents(1); }}
                className="btn btn-primary btn-md"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Agents Grid */}
        {!loading && !backendWarmingUp && agents.length > 0 && (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: 24,
              }}
            >
              {agents.map((agent, index) => {
                const fullName = `${agent.firstName} ${agent.lastName}`;
                const initials = `${agent.firstName?.[0] || ''}${agent.lastName?.[0] || ''}`;
                const isVerified = agent.verificationStatus === 'verified';

                return (
                  <div
                    key={agent._id}
                    style={{
                      background: 'var(--color-white)',
                      borderRadius: 'var(--radius-lg)',
                      padding: 24,
                      boxShadow: 'var(--shadow-sm)',
                      animation: `fadeInUp 0.4s ease-out ${index * 60}ms both`,
                      transition: 'transform 300ms ease, box-shadow 300ms ease',
                    }}
                    className="agent-card"
                  >
                    {/* Header Row */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
                      {/* Avatar */}
                      <div
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          flexShrink: 0,
                          border: isVerified ? '3px solid var(--color-gold-400)' : '3px solid var(--color-cream-200)',
                          overflow: 'hidden',
                          background: 'var(--color-forest-100)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {agent.profileImage ? (
                          <img
                            src={agent.profileImage}
                            alt={fullName}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <span
                            style={{
                              fontFamily: 'var(--font-heading)',
                              fontSize: '1.5rem',
                              fontWeight: 700,
                              color: 'var(--color-forest-700)',
                            }}
                          >
                            {initials}
                          </span>
                        )}
                      </div>

                      {/* Name + Meta */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <h3
                            style={{
                              fontFamily: 'var(--font-heading)',
                              fontSize: 'var(--text-xl)',
                              fontWeight: 600,
                              color: 'var(--color-charcoal-950)',
                              letterSpacing: '-0.01em',
                            }}
                          >
                            {fullName}
                          </h3>
                          {isVerified && (
                            <Check size={18} strokeWidth={2} style={{ color: 'var(--color-forest-600)', flexShrink: 0 }} />
                          )}
                        </div>

                        {agent.agencyName && (
                          <p
                            style={{
                              fontFamily: 'var(--font-body)',
                              fontSize: 'var(--text-sm)',
                              color: 'var(--color-charcoal-600)',
                              marginBottom: 4,
                            }}
                          >
                            {agent.agencyName}
                          </p>
                        )}

                        {agent.location && (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              fontSize: 'var(--text-xs)',
                              color: 'var(--color-charcoal-600)',
                            }}
                          >
                            <MapPin size={12} strokeWidth={1.5} />
                            {agent.location}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Rating */}
                    {typeof agent.rating === 'number' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <div style={{ display: 'flex', gap: 2 }}>
                          {[1, 2, 3, 4, 5].map(i => (
                            <Star
                              key={i}
                              size={14}
                              strokeWidth={1.5}
                              style={{
                                color: i <= Math.round(agent.rating!) ? 'var(--color-gold-500)' : 'var(--color-cream-200)',
                                fill: i <= Math.round(agent.rating!) ? 'currentColor' : 'none',
                              }}
                            />
                          ))}
                        </div>
                        <span
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 700,
                            color: 'var(--color-charcoal-950)',
                          }}
                        >
                          {agent.rating.toFixed(1)}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--text-sm)',
                            color: 'var(--color-charcoal-600)',
                          }}
                        >
                          ({agent.reviewCount || 0} reviews)
                        </span>
                      </div>
                    )}

                    {/* Stats Grid — 2x2 */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 12,
                        marginBottom: 16,
                        padding: 16,
                        background: 'var(--color-cream-50)',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      {[
                        { label: 'Properties Sold', value: agent.propertiesSold ? String(agent.propertiesSold) : '—' },
                        { label: 'Commission Rate', value: agent.commissionRate ? `${agent.commissionRate}%` : '—' },
                        { label: 'Response Time', value: agent.responseTime || '—' },
                        { label: 'Active Listings', value: '—' },
                      ].map(stat => (
                        <div key={stat.label}>
                          <p
                            style={{
                              fontFamily: 'var(--font-body)',
                              fontSize: 'var(--text-xs)',
                              color: 'var(--color-charcoal-600)',
                              marginBottom: 2,
                            }}
                          >
                            {stat.label}
                          </p>
                          <p
                            style={{
                              fontFamily: 'var(--font-body)',
                              fontSize: 'var(--text-sm)',
                              fontWeight: 700,
                              color: 'var(--color-charcoal-950)',
                            }}
                          >
                            {stat.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Specialties */}
                    {(agent.specialties?.length ?? 0) > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                        {agent.specialties!.slice(0, 3).map((specialty, idx) => (
                          <span
                            key={idx}
                            style={{
                              padding: '4px 12px',
                              borderRadius: 'var(--radius-full)',
                              background: 'var(--color-cream-100)',
                              color: 'var(--color-charcoal-700)',
                              fontSize: 'var(--text-xs)',
                              fontWeight: 500,
                              fontFamily: 'var(--font-body)',
                            }}
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Bio */}
                    {agent.bio && (
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--text-sm)',
                          color: 'var(--color-charcoal-700)',
                          lineHeight: 1.65,
                          marginBottom: 20,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {agent.bio}
                      </p>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 12 }}>
                      {agent.phone && (
                        <a
                          href={`tel:${agent.phone}`}
                          className="btn btn-ghost btn-md"
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                          }}
                        >
                          <Phone size={16} strokeWidth={1.5} />
                          Call
                        </a>
                      )}
                      {agent.email && (
                        <a
                          href={`mailto:${agent.email}`}
                          className="btn btn-primary btn-md"
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                          }}
                        >
                          <Mail size={16} strokeWidth={1.5} />
                          Message
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 48, gap: 8 }}>
              <button
                onClick={() => { if (page > 1) loadAgents(page - 1); }}
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
                    onClick={() => loadAgents(pageNum)}
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
                onClick={() => { if (page < pages) loadAgents(page + 1); }}
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
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .agent-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
      `}</style>
    </div>
  );
}