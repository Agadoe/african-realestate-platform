/**
 * Premium UI Components for Scervy Peak
 * Afro-Luxury design system components
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Star, TrendingUp, Award } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// PREMIUM BADGE
// ─────────────────────────────────────────────────────────────────────────────

interface PremiumBadgeProps {
  text?: string;
  variant?: 'gold' | 'forest' | 'terracotta';
  animated?: boolean;
}

export const PremiumBadge: React.FC<PremiumBadgeProps> = ({
  text = 'PREMIUM',
  variant = 'gold',
  animated = true,
}) => {
  const variants = {
    gold: 'linear-gradient(135deg, var(--color-gold-600) 0%, var(--color-gold-700) 100%)',
    forest: 'linear-gradient(135deg, var(--color-forest-600) 0%, var(--color-forest-700) 100%)',
    terracotta: 'linear-gradient(135deg, #c2410c 0%, #9a3412 100%)',
  };

  return (
    <span
      style={{
        background: variants[variant],
        color: '#fff',
        padding: '6px 16px',
        borderRadius: 'var(--radius-full)',
        fontSize: 'var(--text-xs)',
        fontWeight: 700,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {text}
      {animated && (
        <span
          style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'var(--shimmer-gold)',
            animation: 'shimmerGold 3s infinite',
          }}
        />
      )}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// VERIFIED BADGE
// ─────────────────────────────────────────────────────────────────────────────

interface VerifiedBadgeProps {
  verifiedText?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  verifiedText = 'Verified',
  size = 'md',
}) => {
  const sizes = {
    sm: { padding: '4px 10px', fontSize: '10px' },
    md: { padding: '6px 12px', fontSize: 'var(--text-xs)' },
    lg: { padding: '8px 16px', fontSize: 'var(--text-sm)' },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: 'linear-gradient(135deg, var(--color-forest-50) 0%, var(--color-forest-100) 100%)',
        color: 'var(--color-forest-700)',
        ...sizes[size],
        borderRadius: 'var(--radius-full)',
        fontWeight: 600,
        border: '1px solid var(--color-forest-200)',
      }}
    >
      <Shield size={size === 'lg' ? 16 : 14} strokeWidth={2} />
      {verifiedText}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────────────

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  icon,
  trend = 'neutral',
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ x: 4 }}
      className="stat-card"
      style={{
        background: 'var(--color-white)',
        padding: 'var(--space-6)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-sm)',
        borderLeft: '4px solid var(--color-gold-500)',
        transition: 'var(--elevation-transition)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
        {icon && <div style={{ color: 'var(--color-gold-600)' }}>{icon}</div>}
        {trend !== 'neutral' && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              color: trend === 'up' ? 'var(--color-forest-600)' : 'var(--color-gold-600)',
            }}
          >
            <TrendingUp size={14} strokeWidth={2} />
            {trend === 'up' ? '+12%' : '-3%'}
          </span>
        )}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-4xl)',
          fontWeight: 700,
          color: 'var(--color-charcoal-950)',
          lineHeight: 1.2,
          marginBottom: 'var(--space-1)',
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-secondary)',
          fontWeight: 500,
        }}
      >
        {label}
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIAL CARD
// ─────────────────────────────────────────────────────────────────────────────

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  initials: string;
  rating?: number;
  delay?: number;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
  role,
  initials,
  rating = 5,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="testimonial-card"
      style={{
        background: 'var(--color-white)',
        padding: 'var(--space-8)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-md)',
        position: 'relative',
        border: '1px solid var(--color-cream-100)',
      }}
    >
      {/* Quote mark */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '20px',
          fontFamily: 'var(--font-heading)',
          fontSize: '64px',
          color: 'var(--color-gold-200)',
          lineHeight: 1,
          pointerEvents: 'none',
        }}
      >
        "
      </div>

      {/* Rating */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: 'var(--space-4)', marginTop: 'var(--space-8)' }}>
        {Array.from({ length: rating }).map((_, i) => (
          <Star
            key={i}
            size={16}
            strokeWidth={2}
            fill="var(--color-gold-400)"
            style={{ color: 'var(--color-gold-400)' }}
          />
        ))}
      </div>

      {/* Quote */}
      <p
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-xl)',
          fontStyle: 'italic',
          color: 'var(--color-text-primary)',
          lineHeight: 1.65,
          marginBottom: 'var(--space-6)',
        }}
      >
        "{quote}"
      </p>

      {/* Divider */}
      <div
        style={{
          width: '48px',
          height: '3px',
          background: 'var(--color-gold-400)',
          borderRadius: 2,
          marginBottom: 'var(--space-5)',
        }}
      />

      {/* Author */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-forest-100) 0%, var(--color-forest-200) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            color: 'var(--color-forest-700)',
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
        <div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              color: 'var(--color-charcoal-950)',
            }}
          >
            {author}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-charcoal-600)',
            }}
          >
            {role}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE CARD
// ─────────────────────────────────────────────────────────────────────────────

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      style={{
        background: 'var(--color-white)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-8)',
        textAlign: 'center',
        boxShadow: 'var(--shadow-sm)',
        transition: 'var(--elevation-transition)',
      }}
    >
      {/* Icon Box */}
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, var(--color-forest-50) 0%, var(--color-forest-100) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-forest-600)',
          margin: '0 auto var(--space-5)',
          boxShadow: '0 4px 12px rgba(22, 163, 74, 0.15)',
          transition: 'var(--elevation-transition)',
        }}
      >
        {icon}
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-xl)',
          fontWeight: 600,
          color: 'var(--color-charcoal-950)',
          marginBottom: 'var(--space-3)',
        }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.7,
        }}
      >
        {description}
      </p>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// AGENT CARD (PREMIUM)
// ─────────────────────────────────────────────────────────────────────────────

interface AgentCardProps {
  name: string;
  role: string;
  initials: string;
  rating: number;
  listings: number;
  isVerified?: boolean;
  isPremium?: boolean;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  name,
  role,
  initials,
  rating,
  listings,
  isVerified = true,
  isPremium = false,
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      style={{
        background: 'var(--color-white)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
        boxShadow: isPremium ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        border: isPremium ? '2px solid var(--color-gold-400)' : '1px solid var(--color-cream-100)',
        transition: 'var(--elevation-transition)',
        position: 'relative',
      }}
    >
      {isPremium && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
          }}
        >
          <Award size={20} style={{ color: 'var(--color-gold-500)' }} fill="var(--color-gold-200)" />
        </div>
      )}

      {/* Avatar */}
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: isPremium
            ? 'linear-gradient(135deg, var(--color-gold-100) 0%, var(--color-gold-200) 100%)'
            : 'linear-gradient(135deg, var(--color-forest-100) 0%, var(--color-forest-200) 100%)',
          border: isPremium ? '3px solid var(--color-gold-400)' : '3px solid var(--color-forest-200)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--space-4)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 700,
            color: isPremium ? 'var(--color-gold-700)' : 'var(--color-forest-700)',
          }}
        >
          {initials}
        </span>
      </div>

      {/* Name & Role */}
      <h3
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-xl)',
          fontWeight: 600,
          color: 'var(--color-charcoal-950)',
          textAlign: 'center',
          marginBottom: '4px',
        }}
      >
        {name}
      </h3>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-muted)',
          textAlign: 'center',
          marginBottom: 'var(--space-3)',
        }}
      >
        {role}
      </p>

      {/* Verified Badge */}
      {isVerified && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
          <VerifiedBadge verifiedText="Verified Agent" size="sm" />
        </div>
      )}

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-3)',
          paddingTop: 'var(--space-4)',
          borderTop: '1px solid var(--color-cream-200)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              marginBottom: '4px',
            }}
          >
            <Star size={14} fill="var(--color-gold-400)" style={{ color: 'var(--color-gold-400)' }} />
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                fontWeight: 700,
                color: 'var(--color-charcoal-950)',
              }}
            >
              {rating.toFixed(1)}
            </span>
          </div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-muted)',
            }}
          >
            Rating
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-lg)',
              fontWeight: 700,
              color: 'var(--color-charcoal-950)',
              marginBottom: '4px',
            }}
          >
            {listings}
          </div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-muted)',
            }}
          >
            Listings
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default {
  PremiumBadge,
  VerifiedBadge,
  StatCard,
  TestimonialCard,
  FeatureCard,
  AgentCard,
};
