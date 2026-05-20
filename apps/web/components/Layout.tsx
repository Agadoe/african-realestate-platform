import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Home as HomeIcon,
  Heart,
  User,
  Sun,
  Moon,
  Menu,
  X,
  Search,
  MapPin,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function Layout({ children, title, description }: LayoutProps) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomepage = router.pathname === '/';

  const navLinks = [
    { name: 'Properties', href: '/properties' },
    { name: 'Agents', href: '/agents' },
    { name: 'Neighborhoods', href: '/neighborhoods' },
    { name: 'About', href: '/about' },
  ];

  const linkColor = isScrolled
    ? 'var(--color-charcoal-700)'
    : isHomepage
    ? 'rgba(255,255,255,0.88)'
    : 'var(--color-charcoal-700)';

  return (
    <>
      <Head>
        <title>
          {title ? `${title} | Scervy Peak` : 'Scervy Peak — Premium African Real Estate'}
        </title>
        <meta
          name="description"
          content={
            description ||
            'Premium African real estate, elevated. Discover verified properties across Africa.'
          }
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ minHeight: '100vh', background: 'var(--color-cream-50)', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            height: 72,
            background: isScrolled
              ? 'rgba(254,252,248,0.92)'
              : 'transparent',
            backdropFilter: isScrolled ? 'blur(12px)' : 'none',
            borderBottom: isScrolled ? '1px solid var(--color-cream-200)' : 'none',
            boxShadow: isScrolled ? 'var(--shadow-sm)' : 'none',
            transition: 'background-color 300ms ease, backdrop-filter 300ms ease, border-color 300ms ease, box-shadow 300ms ease',
          }}
        >
          <div
            style={{
              maxWidth: 1280,
              margin: '0 auto',
              padding: '0 32px',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Logo */}
            <Link
              href="/"
              style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--radius-xl)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, var(--color-forest-600) 0%, var(--color-forest-700) 100%)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <HomeIcon size={20} strokeWidth={1.5} style={{ color: '#fff' }} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: isScrolled ? 'var(--color-charcoal-950)' : isHomepage ? '#fff' : 'var(--color-charcoal-950)',
                  letterSpacing: '-0.02em',
                }}
              >
                Scervy<span style={{ color: 'var(--color-forest-600)' }}>Peak</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav
              style={{
                display: 'flex',
                gap: 40,
                alignItems: 'center',
              }}
              className="hidden lg:flex"
            >
              {navLinks.map(link => (
                <Link
                  key={link.name}
                  href={link.href}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    color: linkColor,
                    textDecoration: 'none',
                    transition: 'color 200ms',
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }} className="hidden lg:flex">
              <button
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--radius-md)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: linkColor,
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
                  borderRadius: 'var(--radius-md)',
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

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--radius-md)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: linkColor,
              }}
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X size={22} strokeWidth={1.5} />
              ) : (
                <Menu size={22} strokeWidth={1.5} />
              )}
            </button>
          </div>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                top: 72,
                background: 'var(--color-cream-50)',
                zIndex: 49,
                padding: '24px 32px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              {navLinks.map((link, index) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '1.125rem',
                    fontWeight: 500,
                    color: 'var(--color-charcoal-800)',
                    textDecoration: 'none',
                    padding: '16px 0',
                    borderBottom: '1px solid var(--color-cream-200)',
                    animation: `slideInRight 0.3s ease-out ${index * 50}ms both`,
                  }}
                >
                  {link.name}
                </Link>
              ))}
              <div style={{ marginTop: 24 }}>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    background: 'var(--color-forest-600)',
                    color: '#fff',
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
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

        {/* Main Content */}
        <main style={{ flex: 1, paddingTop: 72 }}>
          {children}
        </main>

        {/* Footer */}
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
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 'var(--radius-xl)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, var(--color-forest-600) 0%, var(--color-forest-700) 100%)',
                    }}
                  >
                    <HomeIcon size={20} strokeWidth={1.5} style={{ color: '#fff' }} />
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
                    fontFamily: 'var(--font-body)',
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
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Explore
                </h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, listStyle: 'none', padding: 0, margin: 0 }}>
                  {[
                    { label: 'Properties', href: '/properties' },
                    { label: 'Agents', href: '/agents' },
                    { label: 'Neighborhoods', href: '/neighborhoods' },
                    { label: 'About', href: '/about' },
                  ].map(item => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="footer-link"
                        style={{
                          fontSize: '0.9375rem',
                          textDecoration: 'none',
                          color: 'var(--color-charcoal-500)',
                          fontFamily: 'var(--font-body)',
                          transition: 'color 200ms',
                        }}
                      >
                        {item.label}
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
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Services
                </h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, listStyle: 'none', padding: 0, margin: 0 }}>
                  {[
                    { label: 'Buy', href: '/properties?type=buy' },
                    { label: 'Rent', href: '/properties?type=rent' },
                    { label: 'Sell', href: '/sell' },
                    { label: 'Market Insights', href: '/about' },
                  ].map(item => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="footer-link"
                        style={{
                          fontSize: '0.9375rem',
                          textDecoration: 'none',
                          color: 'var(--color-charcoal-500)',
                          fontFamily: 'var(--font-body)',
                          transition: 'color 200ms',
                        }}
                      >
                        {item.label}
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
                    fontFamily: 'var(--font-body)',
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
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <MapPin size={16} style={{ marginTop: 2, flexShrink: 0, color: 'var(--color-gold-500)' }} strokeWidth={1.5} />
                    Accra, Ghana
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-500)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                    </svg>
                    +233 123 456 789
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-500)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
                    </svg>
                    hello@scervypeak.com
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div
              style={{
                borderTop: '1px solid rgba(255,255,255,0.06)',
                paddingTop: 32,
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-charcoal-600)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                &copy; {new Date().getFullYear()} Scervy Peak. All rights reserved.
              </p>
              <div style={{ display: 'flex', gap: 24 }}>
                {['Terms', 'Privacy', 'Cookies'].map(item => (
                  <Link
                    key={item}
                    href="#"
                    className="footer-link"
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-charcoal-600)',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-body)',
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
            @keyframes slideInRight {
              from { opacity: 0; transform: translateX(20px); }
              to { opacity: 1; transform: translateX(0); }
            }
          `}</style>
        </footer>
      </div>
    </>
  );
}