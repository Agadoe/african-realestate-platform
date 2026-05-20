import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Heart, Users, Home as HomeIcon, ChevronRight, Check } from 'lucide-react';

interface PropertyCardProps {
  property: {
    _id?: string;
    id?: string;
    title: string;
    price: number;
    currency?: string;
    location?: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    areaUnit?: string;
    agent?: {
      name: string;
      rating?: number;
    };
    status?: string;
    listingType?: string;
    image?: string;
    images?: Array<{ url: string }>;
    address?: {
      city: string;
      region: string;
      country?: string;
    };
    isPremium?: boolean;
  };
  priority?: boolean;
  index?: number;
}

export default function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const id = property._id || property.id || '';
  const [favorited, setFavorited] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const imageUrl: string | undefined = property.images?.[0]?.url || property.image;

  const location =
    property.location ||
    (property.address ? `${property.address.city}, ${property.address.region}` : 'Ghana');

  const formatPrice = (price: number, currency = 'GHS') => {
    const sym = currency === 'GHS' ? 'GH₵' : currency === 'USD' ? '$' : '€';
    if (price >= 1_000_000) return `${sym}${(price / 1_000_000).toFixed(1)}M`;
    if (price >= 1_000) return `${sym}${(price / 1_000).toFixed(0)}K`;
    return `${sym}${price.toLocaleString()}`;
  };

  const listingLabel = property.listingType || property.status || 'For Sale';
  const isRent = property.listingType === 'rent' || property.status === 'For Rent';

  return (
    <article
      className="property-card"
      style={{
        animationDelay: `${(index || 0) * 60}ms`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Premium Badge */}
      {property.isPremium && (
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 20,
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, var(--color-gold-600) 0%, var(--color-gold-700) 100%)',
            color: '#fff',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            letterSpacing: '0.08em',
            boxShadow: '0 4px 12px rgba(217, 119, 6, 0.35)',
          }}
        >
          PREMIUM
        </div>
      )}

      {/* Image Container */}
      <div
        style={{
          position: 'relative',
          height: 260,
          overflow: 'hidden',
        }}
      >
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={property.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 400ms ease-out',
              transform: isHovered ? 'scale(1.03)' : 'scale(1)',
            }}
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
              background: 'linear-gradient(135deg, var(--color-cream-100) 0%, var(--color-cream-200) 100%)',
            }}
          >
            <HomeIcon size={40} strokeWidth={1.5} style={{ color: 'var(--color-charcoal-400)' }} />
          </div>
        )}

        {/* Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(28,25,23,0.5) 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        />

        {/* Status Badge — top-left, solid forest green */}
        <span
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            background: 'var(--color-forest-600)',
            color: '#fff',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {listingLabel}
        </span>

        {/* Favorite Button — top-right, gold when active */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setFavorited(!favorited);
          }}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 40,
            height: 40,
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(8px)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 200ms, color 200ms, transform 150ms',
            color: favorited ? 'var(--color-gold-500)' : 'var(--color-charcoal-700)',
          }}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            size={18}
            strokeWidth={1.5}
            style={{ fill: favorited ? 'currentColor' : 'none' }}
          />
        </button>

        {/* Price Badge — bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(8px)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              color: 'var(--color-charcoal-950)',
              letterSpacing: '-0.02em',
            }}
          >
            {formatPrice(property.price, property.currency)}
          </span>
          {isRent && (
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal-600)', marginLeft: 2 }}>
              /mo
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div
        style={{
          padding: 'var(--space-5)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
        }}
      >
        {/* Title */}
        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-xl)',
            fontWeight: 600,
            color: 'var(--color-charcoal-950)',
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
            transition: 'color 200ms ease-out',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {property.title}
        </h3>

        {/* Location */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-charcoal-700)',
          }}
        >
          <MapPin size={14} strokeWidth={1.5} style={{ flexShrink: 0, color: 'var(--color-charcoal-600)' }} />
          <span
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontFamily: 'var(--font-body)',
            }}
          >
            {location}
          </span>
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-charcoal-600)',
            padding: 'var(--space-3) 0',
            borderTop: '1px solid var(--color-cream-200)',
            borderBottom: '1px solid var(--color-cream-200)',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Users size={14} strokeWidth={1.5} />
            {property.bedrooms} beds
          </span>
          <span
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: 'var(--color-cream-300)',
              display: 'inline-block',
            }}
          />
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {property.bathrooms} baths
          </span>
          <span
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: 'var(--color-cream-300)',
              display: 'inline-block',
            }}
          />
          <span>
            {property.area} {property.areaUnit || 'm²'}
          </span>
        </div>

        {/* Footer — Agent + View Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 'var(--space-4)',
            borderTop: '1px solid var(--color-cream-200)',
          }}
        >
          {property.agent ? (
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
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  color: 'var(--color-forest-700)',
                  flexShrink: 0,
                }}
              >
                {property.agent.name
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 500,
                      color: 'var(--color-charcoal-950)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {property.agent.name}
                  </span>
                  <Check size={14} strokeWidth={2} style={{ color: 'var(--color-forest-600)' }} />
                </div>
                <span
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-charcoal-600)',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Verified Agent
                </span>
              </div>
            </div>
          ) : (
            <div />
          )}

          <Link
            href={`/properties/${id}`}
            style={{
              padding: '10px 20px',
              borderRadius: 10,
              background: 'var(--color-forest-600)',
              color: '#fff',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'background 200ms, transform 150ms',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'var(--font-body)',
            }}
          >
            View
            <ChevronRight size={14} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </article>
  );
}