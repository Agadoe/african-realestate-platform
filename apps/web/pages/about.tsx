import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Globe, Heart, TrendingUp, Award, Users } from 'lucide-react';

const STATS = [
  { label: 'Properties Listed', value: '12,000+' },
  { label: 'Active Buyers', value: '45,000+' },
  { label: 'Countries', value: '8' },
  { label: 'Happy Owners', value: '10,000+' },
];

const TEAM_VALUES = [
  {
    icon: TrendingUp,
    title: 'Our Mission',
    description: 'Democratizing property ownership in Africa by connecting buyers, sellers, and agents through technology — eliminating barriers and reducing costs.',
  },
  {
    icon: Globe,
    title: 'Our Vision',
    description: 'To become Africa\'s most trusted property platform, where every African can find, buy, or sell a home with confidence.',
  },
  {
    icon: Users,
    title: 'Community First',
    description: 'We believe property decisions should be driven by people, not commissions. Our platform empowers owners and buyers with transparent information.',
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Head>
        <title>About Scervy Peak | African Real Estate Platform</title>
        <meta name="description" content="Scervy Peak is Africa's premium property platform — connecting buyers, sellers, and agents with transparency and ease." />
      </Head>

      <div style={{ height: 72 }} />

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-forest-900) 0%, var(--color-forest-700) 100%)',
        padding: '80px 32px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <span style={{
            display: 'block', fontSize: '0.75rem', fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--color-gold-400)', marginBottom: 16,
          }}>
            About Scervy Peak
          </span>
          <h1 style={{
            fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 700, color: '#fff', lineHeight: 1.1,
            marginBottom: 24, letterSpacing: '-0.03em',
          }}>
            Africa&apos;s Property Platform, Reimagined
          </h1>
          <p style={{
            fontSize: '1.0625rem', color: 'rgba(255,255,255,0.8)',
            lineHeight: 1.7, maxWidth: 520, margin: '0 auto',
          }}>
            Scervy Peak is more than a listing site. We&apos;re building the infrastructure for how Africa buys, sells, and invests in property — transparently, efficiently, and without gatekeepers.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '48px 32px', background: 'var(--color-cream-100)', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 32, textAlign: 'center',
        }}>
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                fontWeight: 700, color: 'var(--color-forest-700)',
              }}>{value}</p>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '80px 32px', background: 'var(--color-cream-50)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{
              display: 'block', fontSize: '0.75rem', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--color-gold-600)', marginBottom: 12,
            }}>What We Stand For</span>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
              fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em',
            }}>
              Built on Principles, Not Commissions
            </h2>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 32,
          }}>
            {TEAM_VALUES.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: '#fff', borderRadius: 20, padding: 36,
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: 'var(--color-forest-50)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 24,
                }}>
                  <Icon size={24} color="var(--color-forest-700)" />
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-heading)', fontSize: '1.25rem',
                  fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 12,
                }}>
                  {title}
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: '0.9375rem' }}>
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 32px', background: 'var(--color-forest-900)' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <Heart size={40} color="var(--color-gold-400)" style={{ marginBottom: 24 }} />
          <h2 style={{
            fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
            fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 16,
          }}>
            Start Exploring Today
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', lineHeight: 1.7, marginBottom: 36 }}>
            Browse properties across Africa, or list your own — completely free.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/properties"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 28px', fontSize: '0.9375rem',
                background: 'var(--color-gold-500)', color: '#fff',
                borderRadius: 12, textDecoration: 'none', fontWeight: 600,
              }}
            >
              Browse Properties
            </Link>
            <Link
              href="/sell"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 28px', fontSize: '0.9375rem',
                background: 'rgba(255,255,255,0.1)', color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 12, textDecoration: 'none', fontWeight: 500,
              }}
            >
              List Your Property
            </Link>
          </div>
        </div>
      </section>

      <footer style={{ background: 'var(--color-charcoal-950)', padding: '32px', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>
          © 2026 Scervy Peak. All rights reserved.
        </p>
      </footer>
    </div>
  );
}