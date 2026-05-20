import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Search,
  MapPin,
  Home,
  Users,
  ChevronRight,
  Heart,
  Phone,
  Mail,
  Shield,
  CreditCard,
  Headphones,
  Menu,
  X,
  ArrowRight,
  Check,
  Home as HomeIcon,
  Star,
} from 'lucide-react';
import { propertyApi } from '../lib/api';

/* ─── Types ─────────────────────────────────────────────────────────────── */

interface Property {
  _id: string;
  title: string;
  price: number;
  currency: string;
  propertyType: string;
  listingType?: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: string;
  images: Array<{ url: string }>;
  address: { city: string; region: string; country: string };
  agentId?: { firstName: string; lastName: string };
  status?: string;
}

/* ─── Utility: format price ─────────────────────────────────────────────── */

function formatPrice(price: number, currency = 'GHS'): string {
  const sym = currency === 'GHS' ? 'GH₵' : currency === 'USD' ? '$' : '€';
  if (price >= 1_000_000) return `${sym}${(price / 1_000_000).toFixed(1)}M`;
  if (price >= 1_000) return `${sym}${(price / 1_000).toFixed(0)}K`;
  return `${sym}${price.toLocaleString()}`;
}

/* ─── Navigation ─────────────────────────────────────────────────────────── */

function Navbar({ isScrolled }: { isScrolled: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const isHomepage = router.pathname === '/';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[rgba(254,252,248,0.92)] backdrop-blur-[12px] shadow-sm border-b border-cream-200'
          : isHomepage
          ? 'bg-transparent'
          : 'bg-[rgba(254,252,248,0.92)] backdrop-blur-[12px] shadow-sm border-b border-cream-200'
      }`}
      style={{ height: 72 }}
    >
      <div
        className="container flex items-center justify-between"
        style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', height: '100%' }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
            style={{
              background: 'linear-gradient(135deg, var(--color-forest-600) 0%, var(--color-forest-700) 100%)',
            }}
          >
            <HomeIcon size={20} strokeWidth={1.5} className="text-white" />
          </div>
          <span
            className="text-xl font-bold hidden sm:block"
            style={{
              fontFamily: 'var(--font-heading)',
              color: isScrolled
                ? 'var(--color-charcoal-950)'
                : isHomepage
                ? '#fff'
                : 'var(--color-charcoal-950)',
              letterSpacing: '-0.02em',
            }}
          >
            Scervy<span style={{ color: 'var(--color-forest-600)' }}>Peak</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {[
            { label: 'Buy', href: '/properties?type=buy' },
            { label: 'Rent', href: '/properties?type=rent' },
            { label: 'Sell', href: '/sell' },
            { label: 'Agents', href: '/agents' },
            { label: 'About', href: '/about' },
          ].map(link => (
            <Link
              key={link.label}
              href={link.href}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9375rem',
                fontWeight: 500,
                color: isScrolled
                  ? 'var(--color-charcoal-700)'
                  : isHomepage
                  ? 'rgba(255,255,255,0.88)'
                  : 'var(--color-charcoal-700)',
                textDecoration: 'none',
                transition: 'color 200ms',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <button
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isScrolled
                ? 'var(--color-charcoal-700)'
                : isHomepage
                ? '#fff'
                : 'var(--color-charcoal-700)',
              transition: 'background 200ms',
            }}
            aria-label="Saved properties"
          >
            <Heart size={20} strokeWidth={1.5} />
          </button>
          <Link
            href="/login"
            style={{
              height: 44,
              padding: '0 24px',
              borderRadius: 12,
              background: 'var(--color-forest-600)',
              color: '#fff',
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              transition: 'background 200ms, transform 150ms',
            }}
          >
            Sign In
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isScrolled
              ? 'var(--color-charcoal-700)'
              : isHomepage
              ? '#fff'
              : 'var(--color-charcoal-700)',
          }}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="lg:hidden"
          style={{
            position: 'fixed',
            inset: 0,
            top: 72,
            background: 'var(--color-cream-50)',
            zIndex: 99,
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {[
            { label: 'Buy', href: '/properties?type=buy' },
            { label: 'Rent', href: '/properties?type=rent' },
            { label: 'Sell', href: '/sell' },
            { label: 'Agents', href: '/agents' },
            { label: 'About', href: '/about' },
          ].map(link => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.125rem',
                fontWeight: 500,
                color: 'var(--color-charcoal-800)',
                textDecoration: 'none',
                padding: '16px 0',
                borderBottom: '1px solid var(--color-cream-200)',
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ marginTop: 24 }}>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'block',
                textAlign: 'center',
                background: 'var(--color-forest-600)',
                color: '#fff',
                padding: '16px',
                borderRadius: 12,
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* ─── Property Card ─────────────────────────────────────────────────────── */

interface PropertyCardProps {
  property: Property;
  index?: number;
}

function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const [favorited, setFavorited] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageUrl = property.images?.[0]?.url;
  const location = property.address
    ? `${property.address.city}, ${property.address.region}`
    : 'Africa';

  return (
    <article
      className="property-card"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Image */}
      <div className="property-card__image-wrap">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={property.title}
            className="property-card__image"
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--color-cream-200)',
            }}
          >
            <HomeIcon size={40} color="var(--color-charcoal-500)" strokeWidth={1.5} />
          </div>
        )}
        <div className="property-card__image-overlay" />

        {/* Status */}
        <span className="property-card__status">
          {property.listingType || property.status || 'For Sale'}
        </span>

        {/* Favorite Button */}
        <button
          className={`property-card__favorite ${favorited ? 'is-favorite' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            setFavorited(!favorited);
          }}
          aria-label={favorited ? 'Remove from favorites' : 'Save property'}
        >
          <Heart size={18} strokeWidth={1.5} />
        </button>

        {/* Price */}
        <span className="property-card__price">
          {formatPrice(property.price, property.currency)}
        </span>
      </div>

      {/* Body */}
      <div className="property-card__body">
        <h3 className="property-card__title">{property.title}</h3>
        <div className="property-card__location">
          <MapPin size={14} strokeWidth={1.5} style={{ flexShrink: 0 }} />
          <span>{location}</span>
        </div>

        <div className="property-card__stats">
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Users size={14} strokeWidth={1.5} />
            {property.bedrooms} beds
          </span>
          <span>{property.bathrooms} baths</span>
          <span>
            {property.area} {property.areaUnit || 'm²'}
          </span>
        </div>

        <div className="property-card__footer">
          {property.agentId ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--color-forest-700)',
                  overflow: 'hidden',
                }}
              >
                {property.agentId.firstName?.[0]}{property.agentId.lastName?.[0]}
              </div>
              <div>
                <p
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--color-charcoal-950)',
                  }}
                >
                  {property.agentId.firstName} {property.agentId.lastName}
                </p>
                <p
                  style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-600)' }}
                >
                  Verified Agent
                </p>
              </div>
            </div>
          ) : (
            <div />
          )}
          <Link
            href={`/properties/${property._id}`}
            style={{
              padding: '10px 20px',
              borderRadius: 10,
              background: 'var(--color-forest-600)',
              color: '#fff',
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'background 200ms',
            }}
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ─── Skeleton Card ─────────────────────────────────────────────────────── */

function SkeletonCard() {
  return (
    <div
      style={{
        background: 'var(--color-white)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="skeleton" style={{ height: 260 }} />
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="skeleton" style={{ height: 24, width: '75%', borderRadius: 8 }} />
        <div className="skeleton" style={{ height: 16, width: '50%', borderRadius: 8 }} />
        <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
          <div className="skeleton" style={{ height: 16, flex: 1, borderRadius: 8 }} />
          <div className="skeleton" style={{ height: 16, flex: 1, borderRadius: 8 }} />
          <div className="skeleton" style={{ height: 16, flex: 1, borderRadius: 8 }} />
        </div>
      </div>
    </div>
  );
}

/* ─── Footer ────────────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer
      style={{
        background: 'var(--color-charcoal-950)',
        color: 'var(--color-charcoal-400)',
        padding: '80px 0 40px',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 32px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 48,
            marginBottom: 64,
          }}
        >
          {/* Brand Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, var(--color-forest-600) 0%, var(--color-forest-700) 100%)',
                }}
              >
                <HomeIcon size={20} strokeWidth={1.5} className="text-white" />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#fff',
                  letterSpacing: '-0.02em',
                }}
              >
                Scervy<span style={{ color: 'var(--color-forest-400)' }}>Peak</span>
              </span>
            </div>
            <p
              style={{
                fontSize: '0.9375rem',
                lineHeight: 1.7,
                color: 'var(--color-charcoal-500)',
                maxWidth: 280,
                marginBottom: 24,
              }}
            >
              Premium African real estate, elevated. Discover verified properties across Africa&apos;s most desirable locations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-cream-100)',
                marginBottom: 20,
              }}
            >
              Quick Links
            </h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, listStyle: 'none', padding: 0, margin: 0 }}>
              {['Properties', 'Agents', 'Neighborhoods', 'About'].map(item => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="footer-link"
                    style={{
                      fontSize: '0.9375rem',
                      textDecoration: 'none',
                      color: 'var(--color-charcoal-500)',
                      transition: 'color 200ms',
                    }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-cream-100)',
                marginBottom: 20,
              }}
            >
              Services
            </h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, listStyle: 'none', padding: 0, margin: 0 }}>
              {['Buy', 'Rent', 'Sell', 'Market Insights'].map(item => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="footer-link"
                    style={{
                      fontSize: '0.9375rem',
                      textDecoration: 'none',
                      color: 'var(--color-charcoal-500)',
                      transition: 'color 200ms',
                    }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-cream-100)',
                marginBottom: 20,
              }}
            >
              Contact
            </h3>
            <ul
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                listStyle: 'none',
                padding: 0,
                margin: 0,
                fontSize: '0.9375rem',
              }}
            >
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <MapPin size={16} style={{ marginTop: 2, flexShrink: 0, color: 'var(--color-gold-500)' }} strokeWidth={1.5} />
                Accra, Ghana
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Phone size={16} style={{ flexShrink: 0, color: 'var(--color-gold-500)' }} strokeWidth={1.5} />
                +233 123 456 789
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Mail size={16} style={{ flexShrink: 0, color: 'var(--color-gold-500)' }} strokeWidth={1.5} />
                hello@scervypeak.com
              </li>
            </ul>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: 32,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <p style={{ fontSize: '0.875rem', color: 'var(--color-charcoal-600)' }}>
            © {new Date().getFullYear()} Scervy Peak. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Terms', 'Privacy', 'Cookies'].map(item => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="footer-link"
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-charcoal-600)',
                  textDecoration: 'none',
                  transition: 'color 200ms',
                }}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .footer-link:hover {
          color: var(--color-gold-500) !important;
        }
      `}</style>
    </footer>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────────── */

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchBedrooms, setSearchBedrooms] = useState('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    propertyApi.getProperties({ limit: 6, sortBy: 'createdAt', order: 'desc' })
      .then(res => setProperties(res.data.properties || []))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params: Record<string, string> = {};
    if (searchLocation) params.location = searchLocation;
    if (searchType) params.propertyType = searchType;
    if (searchBedrooms) params.bedrooms = searchBedrooms;
    window.location.href = `/properties?${new URLSearchParams(params).toString()}`;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-cream-50)' }}>
      <Head>
        <title>Scervy Peak — Premium African Real Estate</title>
        <meta
          name="description"
          content="Find premium properties across Africa with verified agents, secure transactions, and exceptional service."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar isScrolled={isScrolled} />

      <main>
        {/* ══════════════════════════════════════════════════════════════════
            HERO SECTION
            ══════════════════════════════════════════════════════════════════ */}
        <section
          style={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Background Image */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: "url('https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1920&q=80')",
              backgroundSize: 'cover',
              backgroundPosition: 'center 30%',
            }}
            className="hero-ken-burns"
          />

          {/* Gradient Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(165deg, rgba(5,46,22,0.72) 0%, rgba(5,46,22,0.35) 60%, rgba(5,46,22,0.55) 100%)',
            }}
          />

          {/* Hero Content */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              textAlign: 'center',
              maxWidth: 900,
              padding: '0 32px',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-gold-400)',
                marginBottom: 24,
              }}
              className="animate-fade-in"
            >
              WHERE AFRICA FINDS ITS PEAK
            </p>

            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.75rem, 6vw, 4rem)',
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: '-0.035em',
                color: '#ffffff',
                marginBottom: 24,
              }}
              className="animate-slide-up"
            >
              Find Your Dream Property<br />Across Africa
            </h1>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.125rem',
                color: 'rgba(255,255,255,0.85)',
                maxWidth: 560,
                margin: '0 auto 48px',
                lineHeight: 1.65,
              }}
              className="animate-slide-up"
            >
              Premium listings, verified agents, and seamless transactions — all in one place.
            </p>

            {/* CTA Buttons */}
            <div
              style={{
                display: 'flex',
                gap: 16,
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: 56,
              }}
              className="animate-slide-up"
            >
              <Link
                href="/properties"
                className="btn btn-lg inline-flex items-center gap-2"
                style={{
                  background: 'var(--color-forest-600)',
                  color: '#fff',
                  borderRadius: 14,
                  padding: '16px 36px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'background 200ms, transform 150ms',
                  boxShadow: '0 4px 20px rgba(22,163,74,0.35)',
                }}
              >
                Browse Properties
                <ArrowRight size={18} strokeWidth={1.5} />
              </Link>
              <Link
                href="/register"
                style={{
                  padding: '16px 36px',
                  borderRadius: 14,
                  background: 'transparent',
                  color: '#fff',
                  border: '1.5px solid rgba(255,255,255,0.5)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'background 200ms, border-color 200ms',
                }}
              >
                List Your Property
              </Link>
            </div>

            {/* Search Panel */}
            <div
              style={{
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(12px)',
                borderRadius: 20,
                padding: 24,
                boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
                maxWidth: 900,
                margin: '0 auto',
              }}
              className="animate-slide-up"
            >
              <form
                onSubmit={handleSearch}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 16,
                  alignItems: 'end',
                }}
              >
                {/* Location */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--color-charcoal-700)',
                      marginBottom: 8,
                      letterSpacing: '0.02em',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    Location
                  </label>
                  <div style={{ position: 'relative' }}>
                    <MapPin
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
                      placeholder="City, region, or country..."
                      value={searchLocation}
                      onChange={e => setSearchLocation(e.target.value)}
                      className="input"
                      style={{ paddingLeft: 48 }}
                    />
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--color-charcoal-700)',
                      marginBottom: 8,
                      letterSpacing: '0.02em',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    Property Type
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Home
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
                    <select
                      value={searchType}
                      onChange={e => setSearchType(e.target.value)}
                      className="input"
                      style={{ paddingLeft: 48, appearance: 'none', cursor: 'pointer' }}
                    >
                      <option value="">All Types</option>
                      <option value="House">House</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Villa">Villa</option>
                      <option value="Land">Land</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>
                </div>

                {/* Bedrooms */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--color-charcoal-700)',
                      marginBottom: 8,
                      letterSpacing: '0.02em',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    Bedrooms
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Users
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
                    <select
                      value={searchBedrooms}
                      onChange={e => setSearchBedrooms(e.target.value)}
                      className="input"
                      style={{ paddingLeft: 48, appearance: 'none', cursor: 'pointer' }}
                    >
                      <option value="">Any</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4+</option>
                    </select>
                  </div>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="btn btn-primary btn-lg inline-flex items-center gap-2"
                  style={{
                    background: 'var(--color-forest-600)',
                    color: '#fff',
                    borderRadius: 12,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    minHeight: 52,
                    padding: '14px 28px',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <Search size={18} strokeWidth={1.5} />
                  Search
                </button>
              </form>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              color: 'rgba(255,255,255,0.6)',
              zIndex: 1,
            }}
          >
            <span
              style={{
                fontSize: '0.6875rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-body)',
              }}
            >
              Scroll
            </span>
            <div
              style={{
                width: 24,
                height: 40,
                border: '1.5px solid rgba(255,255,255,0.4)',
                borderRadius: 12,
                position: 'relative',
              }}
            >
              <div className="scroll-dot" />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            TRUST BAR
            ══════════════════════════════════════════════════════════════════ */}
        <section
          style={{
            background: 'var(--color-forest-900)',
            padding: '48px 0',
          }}
        >
          <div
            style={{
              maxWidth: 1280,
              margin: '0 auto',
              padding: '0 32px',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 32,
              textAlign: 'center',
            }}
          >
            {[
              { value: '12,400+', label: 'Properties Listed' },
              { value: '84', label: 'Cities Covered' },
              { value: '2,100+', label: 'Verified Agents' },
              { value: '8,900+', label: 'Happy Clients' },
            ].map(stat => (
              <div key={stat.label}>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    color: 'var(--color-gold-400)',
                    lineHeight: 1.1,
                    marginBottom: 8,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9375rem',
                    color: 'var(--color-cream-200)',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            FEATURED PROPERTIES
            ══════════════════════════════════════════════════════════════════ */}
        <section style={{ padding: '96px 0', background: 'var(--color-cream-50)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
            {/* Section Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: 56,
                flexWrap: 'wrap',
                gap: 24,
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--color-forest-600)',
                    marginBottom: 12,
                  }}
                >
                  Premier Listings
                </p>
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                    fontWeight: 700,
                    lineHeight: 1.15,
                    letterSpacing: '-0.025em',
                    color: 'var(--color-charcoal-950)',
                    marginBottom: 12,
                  }}
                >
                  Featured Properties
                </h2>
                <p
                  style={{
                    fontSize: '1.0625rem',
                    color: 'var(--color-charcoal-600)',
                    maxWidth: 480,
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Handpicked properties across Africa&apos;s most desirable locations.
                </p>
              </div>
              <Link
                href="/properties"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: 'var(--color-forest-600)',
                  textDecoration: 'none',
                  padding: '12px 24px',
                  borderRadius: 12,
                  border: '1.5px solid var(--color-forest-600)',
                  transition: 'background 200ms, color 200ms',
                }}
              >
                View All Properties
                <ChevronRight size={18} strokeWidth={1.5} />
              </Link>
            </div>

            {/* Properties Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: 32,
              }}
            >
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
              ) : properties.length > 0 ? (
                properties.map((property, i) => (
                  <PropertyCard key={property._id} property={property} index={i} />
                ))
              ) : (
                <p
                  style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    color: 'var(--color-charcoal-600)',
                    padding: '80px 0',
                    fontSize: '1.0625rem',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Backend warming up — properties loading shortly
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            HOW IT WORKS
            ══════════════════════════════════════════════════════════════════ */}
        <section style={{ padding: '96px 0', background: 'var(--color-white)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
            {/* Section Header */}
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--color-forest-600)',
                  marginBottom: 12,
                }}
              >
                How It Works
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                  fontWeight: 700,
                  lineHeight: 1.15,
                  letterSpacing: '-0.025em',
                  color: 'var(--color-charcoal-950)',
                  marginBottom: 16,
                }}
              >
                Your Path to Property Ownership
              </h2>
              <p
                style={{
                  fontSize: '1.0625rem',
                  color: 'var(--color-charcoal-600)',
                  maxWidth: 520,
                  margin: '0 auto',
                  fontFamily: 'var(--font-body)',
                }}
              >
                Three simple steps to finding and securing your perfect property.
              </p>
            </div>

            {/* 3 Steps */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 48,
                position: 'relative',
              }}
            >
              {/* Dashed connector line */}
              <div
                style={{
                  position: 'absolute',
                  top: 40,
                  left: '16.67%',
                  right: '16.67%',
                  height: 1,
                  borderTop: '1px dashed var(--color-cream-200)',
                  zIndex: 0,
                }}
                className="hidden md:block"
              />

              {[
                {
                  num: '01',
                  icon: <Search size={28} strokeWidth={1.5} />,
                  title: 'Search & Discover',
                  desc: 'Browse thousands of verified properties across Africa&apos;s most desirable locations.',
                },
                {
                  num: '02',
                  icon: <Users size={28} strokeWidth={1.5} />,
                  title: 'Connect with Agents',
                  desc: 'Chat directly with verified agents, schedule viewings, and get answers to your questions.',
                },
                {
                  num: '03',
                  icon: <Shield size={28} strokeWidth={1.5} />,
                  title: 'Close the Deal',
                  desc: 'Secure payments, legal support, and keys in hand — all handled professionally.',
                },
              ].map((step, i) => (
                <div
                  key={step.title}
                  style={{
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {/* Number */}
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '4rem',
                      fontWeight: 700,
                      color: 'var(--color-forest-100)',
                      lineHeight: 1,
                      marginBottom: 16,
                    }}
                  >
                    {step.num}
                  </div>
                  {/* Icon */}
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 'var(--radius-xl)',
                      background: 'var(--color-forest-50)',
                      color: 'var(--color-forest-600)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                    }}
                  >
                    {step.icon}
                  </div>
                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: 'var(--color-charcoal-950)',
                      marginBottom: 12,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {step.title}
                  </h3>
                  {/* Description */}
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9375rem',
                      color: 'var(--color-charcoal-600)',
                      lineHeight: 1.65,
                    }}
                    dangerouslySetInnerHTML={{ __html: step.desc }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            TESTIMONIALS
            ══════════════════════════════════════════════════════════════════ */}
        <section style={{ padding: '96px 0', background: 'var(--color-cream-50)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
            {/* Section Header */}
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--color-forest-600)',
                  marginBottom: 12,
                }}
              >
                What Our Clients Say
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                  fontWeight: 700,
                  lineHeight: 1.15,
                  letterSpacing: '-0.025em',
                  color: 'var(--color-charcoal-950)',
                }}
              >
                WHAT OUR CLIENTS SAY
              </h2>
            </div>

            {/* Testimonials Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 32,
              }}
            >
              {[
                {
                  quote:
                    'Scervy Peak made finding our dream home in Accra effortless. The agent verification gave us complete peace of mind — we closed within 3 weeks.',
                  name: 'Ama Serwaa',
                  role: 'Homeowner, Accra',
                  initials: 'AS',
                },
                {
                  quote:
                    'As a property investor, I need data and trust. Scervy Peak delivers both. The market intelligence helped me identify 3 high-yield opportunities.',
                  name: 'Kwame Mensah',
                  role: 'Investor, Lagos',
                  initials: 'KM',
                },
                {
                  quote:
                    'The rental process used to be a nightmare. With Scervy Peak, I found a verified apartment in 48 hours. The support team stayed with me every step.',
                  name: 'Fatima Al-Hassan',
                  role: 'Tenant, Nairobi',
                  initials: 'FA',
                },
              ].map((t) => (
                <div
                  key={t.name}
                  style={{
                    background: 'var(--color-white)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 40,
                    boxShadow: 'var(--shadow-md)',
                    position: 'relative',
                    border: '1px solid var(--color-cream-200)',
                  }}
                >
                  {/* Quote Mark */}
                  <div
                    style={{
                      fontFamily: 'Georgia, serif',
                      fontSize: 72,
                      color: 'var(--color-gold-200)',
                      lineHeight: 1,
                      marginBottom: 24,
                    }}
                  >
                    &ldquo;
                  </div>

                  {/* Quote Text */}
                  <p
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.125rem',
                      fontStyle: 'italic',
                      color: 'var(--color-charcoal-800)',
                      lineHeight: 1.7,
                      marginBottom: 32,
                    }}
                  >
                    {t.quote}
                  </p>

                  {/* Divider */}
                  <div
                    style={{
                      width: 48,
                      height: 3,
                      background: 'var(--color-gold-400)',
                      borderRadius: 2,
                      marginBottom: 24,
                    }}
                  />

                  {/* Author */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        background: 'var(--color-forest-100)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: 'var(--color-forest-700)',
                        flexShrink: 0,
                      }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.9375rem',
                          fontWeight: 700,
                          color: 'var(--color-charcoal-950)',
                        }}
                      >
                        {t.name}
                      </p>
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.8125rem',
                          color: 'var(--color-charcoal-600)',
                        }}
                      >
                        {t.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            CTA BANNER
            ══════════════════════════════════════════════════════════════════ */}
        <section
          style={{
            padding: '96px 0',
            background:
              'linear-gradient(135deg, var(--color-forest-800) 0%, var(--color-forest-900) 100%)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.05,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              maxWidth: 800,
              margin: '0 auto',
              padding: '0 32px',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.25rem, 4vw, 3rem)',
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.15,
                letterSpacing: '-0.025em',
                marginBottom: 20,
              }}
            >
              Ready to Find Your Perfect Property?
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.125rem',
                color: 'var(--color-gold-400)',
                marginBottom: 48,
              }}
            >
              Join thousands of satisfied buyers and investors across Africa.
            </p>

            {/* CTA Buttons */}
            <div
              style={{
                display: 'flex',
                gap: 16,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Link
                href="/properties"
                style={{
                  padding: '18px 40px',
                  borderRadius: 14,
                  background: 'var(--color-gold-600)',
                  color: '#fff',
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'background 200ms, transform 150ms',
                  boxShadow: '0 4px 20px rgba(217,119,6,0.3)',
                }}
              >
                Browse Properties
              </Link>
              <Link
                href="/agents"
                style={{
                  padding: '18px 40px',
                  borderRadius: 14,
                  background: 'transparent',
                  color: '#fff',
                  border: '1.5px solid rgba(255,255,255,0.4)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'background 200ms, border-color 200ms',
                }}
              >
                Become an Agent
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
        .hero-ken-burns {
          animation: kenBurns 20s ease-out forwards;
        }
        @keyframes kenBurns {
          from { transform: scale(1.05); }
          to   { transform: scale(1.0); }
        }
        .scroll-dot {
          position: absolute;
          top: 6px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 8px;
          background: rgba(255,255,255,0.7);
          border-radius: 2px;
          animation: scrollBounce 2s ease-in-out infinite;
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 1; }
          50% { transform: translateX(-50%) translateY(10px); opacity: 0.5; }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out both;
        }
        .animate-slide-up {
          animation: slideUp 0.5s ease-out both;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .property-card {
          animation: fadeInUp 0.4s ease-out both;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}