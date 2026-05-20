import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiMapPin, FiHeart, FiMaximize, FiDroplet, FiHome, FiChevronRight, FiCheck } from 'react-icons/fi';
import { useFavorites } from '../lib/hooks';
import { formatCurrency } from '../lib/hooks';

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
      rating: number;
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

export default function PropertyCard({ property, priority = false, index = 0 }: PropertyCardProps) {
  const id = property._id || property.id || '';
  const { isFavorite, toggleFavorite } = useFavorites(id);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (id) toggleFavorite(id);
  };

  // Get image URL - support both old `image` and new `images` array
  const imageUrl: string | undefined = property.images?.[0]?.url || property.image;
  const hasValidImage = imageUrl && !imageError;

  const location = property.location ||
    (property.address ? `${property.address.city}, ${property.address.region}` : 'Ghana');

  // Format price for display
  const formatPrice = (price: number, currency = 'GHS') => {
    const sym = currency === 'GHS' ? 'GH₵' : currency === 'USD' ? '$' : '€';
    if (price >= 1_000_000) return `${sym}${(price / 1_000_000).toFixed(1)}M`;
    if (price >= 1_000) return `${sym}${(price / 1_000).toFixed(0)}K`;
    return `${sym}${price.toLocaleString()}`;
  };

  return (
    <motion.article
      className="property-card group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'var(--color-white)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: isHovered ? 'var(--shadow-card-hover)' : 'var(--shadow-sm)',
        border: property.isPremium ? '2px solid var(--color-gold-400)' : '1px solid var(--color-cream-100)',
        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        position: 'relative',
      }}
    >
      {/* Premium Badge */}
      {property.isPremium && (
        <div
          className="absolute top-3 right-3 z-20 px-3 py-1 rounded-full text-xs font-bold tracking-wider"
          style={{
            background: 'linear-gradient(135deg, var(--color-gold-500) 0%, var(--color-gold-600) 100%)',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(217, 119, 6, 0.35)',
            letterSpacing: '0.08em',
          }}
        >
          PREMIUM
        </div>
      )}

      {/* Image Container */}
      <div
        className="relative overflow-hidden"
        style={{ height: 260 }}
      >
        {hasValidImage ? (
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            onError={() => setImageError(true)}
            priority={priority}
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--color-cream-100) 0%, var(--color-cream-200) 100%)' }}
          >
            <FiHome className="text-charcoal-400 text-4xl" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(28,25,23,0.6) 0%, rgba(28,25,23,0.1) 40%, transparent 70%)',
            transition: 'opacity 300ms',
          }}
        />

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(8px)',
              color: 'var(--color-charcoal-950)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {property.listingType || property.status || 'For Sale'}
          </span>
        </div>

        {/* Favorite Button - Glassmorphism */}
        <motion.button
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 p-2.5 rounded-full z-10"
          style={{
            background: isFavorite(id)
              ? 'rgba(239, 68, 68, 0.9)'
              : 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(12px)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 200ms ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
          whileTap={{ scale: 0.92 }}
          aria-label={isFavorite(id) ? 'Remove from favorites' : 'Add to favorites'}
        >
          <FiHeart
            size={18}
            strokeWidth={1.5}
            className={isFavorite(id) ? 'text-white fill-current' : 'text-charcoal-700'}
          />
        </motion.button>

        {/* Price Tag - Glassmorphism */}
        <div
          className="absolute bottom-4 left-4 px-4 py-2 rounded-xl"
          style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
          }}
        >
          <span
            className="font-bold text-lg"
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-charcoal-950)',
              letterSpacing: '-0.02em',
            }}
          >
            {formatPrice(property.price, property.currency)}
          </span>
          {property.listingType === 'rent' && (
            <span className="text-sm text-charcoal-600 ml-1">/mo</span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div
        className="p-6"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Title */}
        <h3
          className="font-semibold line-clamp-1 group-hover:text-forest-600 transition-colors duration-200"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-xl)',
            color: 'var(--color-charcoal-950)',
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
          }}
        >
          {property.title}
        </h3>

        {/* Location */}
        <div
          className="flex items-center"
          style={{ color: 'var(--color-charcoal-600)' }}
        >
          <FiMapPin size={14} strokeWidth={1.5} className="flex-shrink-0 mr-2" style={{ color: 'var(--color-forest-500)' }} />
          <span
            className="text-sm line-clamp-1"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {location}
          </span>
        </div>

        {/* Stats Row */}
        <div
          className="flex items-center justify-between py-3 border-y"
          style={{
            borderColor: 'var(--color-cream-200)',
            color: 'var(--color-charcoal-600)',
          }}
        >
          <span className="flex items-center text-sm" style={{ fontFamily: 'var(--font-body)' }}>
            <FiMaximize size={14} strokeWidth={1.5} className="mr-1.5" />
            {property.bedrooms} beds
          </span>
          <span
            className="w-1 h-1 rounded-full"
            style={{ background: 'var(--color-cream-300)' }}
          />
          <span className="flex items-center text-sm" style={{ fontFamily: 'var(--font-body)' }}>
            <FiDroplet size={14} strokeWidth={1.5} className="mr-1.5" />
            {property.bathrooms} baths
          </span>
          <span
            className="w-1 h-1 rounded-full"
            style={{ background: 'var(--color-cream-300)' }}
          />
          <span className="flex items-center text-sm" style={{ fontFamily: 'var(--font-body)' }}>
            <FiMaximize size={14} strokeWidth={1.5} className="mr-1.5" />
            {property.area} {property.areaUnit || 'm²'}
          </span>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-2"
        >
          {property.agent ? (
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  background: 'linear-gradient(135deg, var(--color-forest-100) 0%, var(--color-forest-200) 100%)',
                  color: 'var(--color-forest-700)',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {property.agent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-sm font-semibold"
                    style={{
                      color: 'var(--color-charcoal-950)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {property.agent.name}
                  </span>
                  <FiCheck size={14} className="text-forest-500" />
                </div>
                <span className="text-xs" style={{ color: 'var(--color-charcoal-500)' }}>
                  Verified Agent
                </span>
              </div>
            </div>
          ) : (
            <div />
          )}

          <Link
            href={`/properties/${id}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:gap-2.5"
            style={{
              background: 'linear-gradient(135deg, var(--color-forest-600) 0%, var(--color-forest-700) 100%)',
              color: '#fff',
              fontFamily: 'var(--font-body)',
              boxShadow: '0 2px 8px rgba(22, 163, 74, 0.25)',
            }}
          >
            View <FiChevronRight size={14} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}