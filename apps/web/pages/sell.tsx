import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, TrendingUp, Shield, Users, Check, ArrowRight, Star } from 'lucide-react';

const SELL_STEPS = [
  {
    icon: Home,
    title: 'Create Your Listing',
    description: 'Fill in property details, add photos, set your price. Takes about 10 minutes.',
  },
  {
    icon: Shield,
    title: 'We Verify Everything',
    description: 'Our team reviews your listing for accuracy and quality before it goes live.',
  },
  {
    icon: TrendingUp,
    title: 'Connect with Buyers',
    description: 'Reach qualified buyers and agents directly through our platform.',
  },
];

const SELL_BENEFITS = [
  'Direct connection with buyers — no middlemen',
  'Professional listing presentation',
  'Built-in analytics and performance tracking',
  'Verified owner badge for trust',
  'AI-powered pricing recommendations',
  'Multi-platform promotion',
];

export default function SellPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleCta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Route to owner registration
    window.location.href = `/register?role=owner&email=${encodeURIComponent(email)}`;
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <Head>
        <title>Sell Your Property | Scervy Peak</title>
        <meta name="description" content="List your property directly on Scervy Peak. Reach thousands of verified buyers and agents across Africa." />
      </Head>

      {/* Hero */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--color-forest-900) 0%, var(--color-forest-700) 50%, var(--color-forest-800) 100%)',
          padding: '120px 32px 100px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background pattern */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05 }}>
          <svg width="100%" height="100%"><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1"/></pattern><rect width="100%" height="100%" fill="url(#grid)"/></svg>
        </div>
        <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow" style={{ color: 'var(--color-gold-400)', marginBottom: 16, display: 'inline-block' }}>
              Property Owners
            </span>
            <h1 className="text-headline" style={{ color: '#fff', marginBottom: 24, fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              List Your Property<br />Directly, Without Agents
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-xl)', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.6 }}>
              Scervy Peak connects property owners directly with qualified buyers and tenants across Africa. Save on agent commissions. Get more views. Close faster.
            </p>
            <form onSubmit={handleCta} style={{ display: 'flex', gap: 12, maxWidth: 480, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: 240,
                  padding: '14px 20px',
                  borderRadius: 12,
                  border: '2px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: 'var(--text-base)',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '14px 28px',
                  borderRadius: 12,
                  background: 'var(--color-gold-500)',
                  color: 'var(--color-charcoal-950)',
                  fontWeight: 700,
                  fontSize: 'var(--text-base)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                List Property <ArrowRight />
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 32px', background: 'var(--color-cream-100)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span className="eyebrow" style={{ color: 'var(--color-forest-600)' }}>Simple Process</span>
            <h2 className="text-section" style={{ marginTop: 12 }}>Three Steps to Your Listing</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
            {SELL_STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                style={{
                  background: '#fff',
                  borderRadius: 20,
                  padding: '40px 32px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                  border: '1px solid var(--color-cream-200)',
                }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: 'linear-gradient(135deg, var(--color-forest-600), var(--color-forest-700))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 24,
                }}>
                  <step.icon size={24} color="#fff" />
                </div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-gold-600)', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>
                  STEP {i + 1}
                </div>
                <h3 className="text-card" style={{ marginBottom: 12 }}>{step.title}</h3>
                <p className="text-body" style={{ color: 'var(--color-charcoal-600)' }}>{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: '80px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 64, alignItems: 'center' }}>
          <div>
            <span className="eyebrow" style={{ color: 'var(--color-forest-600)' }}>Why List Direct</span>
            <h2 className="text-section" style={{ marginTop: 12, marginBottom: 32 }}>The Smarter Way to Sell</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {SELL_BENEFITS.map((b) => (
                <div key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--color-forest-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <Check size={14} color="#fff" />
                  </div>
                  <span className="text-label" style={{ color: 'var(--color-charcoal-700)' }}>{b}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 32 }}>
              <Link
                href="/register?role=owner"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 28px',
                  background: 'var(--color-forest-700)',
                  color: '#fff', borderRadius: 12, fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Get Started Free <ArrowRight />
              </Link>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--color-cream-100), var(--color-cream-200))',
              borderRadius: 24,
              padding: '48px 40px',
              border: '1px solid var(--color-cream-300)',
            }}>
              <Star size={40} color="var(--color-gold-500)" style={{ marginBottom: 16 }} />
              <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-charcoal-900)', marginBottom: 8 }}>10,000+</p>
              <p style={{ color: 'var(--color-charcoal-600)', marginBottom: 24 }}>Property owners trust Scervy Peak</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 32 }}>
                {[['Avg. Days to Sale', '28'], ['Views per Listing', '340'], ['Owner Satisfaction', '96%']].map(([label, val]) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--color-forest-700)', fontFamily: 'var(--font-mono)' }}>{val}</p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-500)', marginTop: 4 }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section style={{ padding: '80px 32px', background: 'var(--color-forest-900)', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 className="text-title" style={{ color: '#fff', marginBottom: 16 }}>Ready to List?</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 32 }}>Join thousands of property owners who sell faster with Scervy Peak.</p>
          <Link
            href="/register?role=owner"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '16px 36px',
              background: 'var(--color-gold-500)',
              color: 'var(--color-charcoal-950)', borderRadius: 12, fontWeight: 700,
              textDecoration: 'none', fontSize: 'var(--text-lg)',
            }}
          >
            Create Free Listing <ArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}