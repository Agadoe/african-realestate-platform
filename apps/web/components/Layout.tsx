import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiHome, FiSearch, FiUser, FiHeart, FiMenu, FiX, FiSun, FiMoon, FiTwitter, FiInstagram, FiLinkedin, FiFacebook } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function Layout({ children, title, description }: LayoutProps) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleDarkMode = () => {
      const isDark = localStorage.getItem('darkMode') === 'true' ||
        (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleDarkMode();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const navigation = [
    { name: 'Properties', href: '/properties' },
    { name: 'Agents', href: '/agents' },
    { name: 'Neighborhoods', href: '/neighborhoods' },
    { name: 'About', href: '/about' },
  ];

  return (
    <>
      <Head>
        <title>{title ? `${title} | African Real Estate` : 'African Real Estate Platform'}</title>
        <meta name="description" content={description || 'Premium real estate platform for the African market'} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col bg-cream-50">
        {/* Header - Premium Glassmorphism */}
        <header
          className={`fixed w-full z-50 transition-all duration-500 ${
            isScrolled
              ? 'bg-white/85 dark:bg-charcoal-950/85 backdrop-blur-xl shadow-lg border-b border-cream-200/50'
              : 'bg-transparent'
          }`}
          style={{ backdropFilter: isScrolled ? 'blur(20px)' : 'none' }}
        >
          <div
            className="container flex items-center justify-between py-4"
            style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}
          >
            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                style={{
                  background: 'linear-gradient(135deg, var(--color-forest-600) 0%, var(--color-forest-700) 100%)',
                }}
              >
                <FiHome className="text-white text-lg" />
              </div>
              <span
                className="text-xl font-bold hidden sm:block"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: isScrolled ? 'var(--color-charcoal-950)' : (router.pathname === '/' ? '#fff' : 'var(--color-charcoal-950)'),
                  letterSpacing: '-0.02em',
                }}
              >
                Scervy<span style={{ color: 'var(--color-forest-600)' }}>Peak</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-medium transition-all duration-200 relative group ${
                    router.pathname === item.href
                      ? 'text-forest-600 dark:text-forest-400'
                      : 'text-charcoal-700 dark:text-charcoal-500 hover:text-forest-600 dark:hover:text-forest-400'
                  }`}
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {item.name}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${
                      router.pathname === item.href ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                    style={{ background: 'var(--color-gold-500)' }}
                  />
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-3">
              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-xl hover:bg-cream-100 dark:hover:bg-charcoal-800 transition-colors"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? (
                  <FiSun className="text-charcoal-700 dark:text-charcoal-300 text-lg" />
                ) : (
                  <FiMoon className="text-charcoal-700 text-lg" />
                )}
              </button>

              {/* Favorites */}
              <button className="p-2.5 rounded-xl hover:bg-cream-100 dark:hover:bg-charcoal-800 transition-colors hidden md:flex items-center justify-center">
                <FiHeart className="text-charcoal-700 dark:text-charcoal-300 text-lg" />
              </button>

              {/* Sign In */}
              <Link
                href="/login"
                className="hidden md:flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, var(--color-forest-600) 0%, var(--color-forest-700) 100%)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                Sign In
              </Link>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2.5 rounded-xl hover:bg-cream-100 dark:hover:bg-charcoal-800"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <FiX className="text-charcoal-700 dark:text-charcoal-300 text-xl" />
                ) : (
                  <FiMenu className="text-charcoal-700 dark:text-charcoal-300 text-xl" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation - Animated */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden bg-white/95 dark:bg-charcoal-950/95 backdrop-blur-xl border-t border-cream-200 dark:border-charcoal-800"
              >
                <div className="container py-6 space-y-1" style={{ padding: '24px 32px' }}>
                  {navigation.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        className={`block py-3 px-4 rounded-xl font-medium transition-colors ${
                          router.pathname === item.href
                            ? 'bg-forest-50 dark:bg-forest-900/30 text-forest-600 dark:text-forest-400'
                            : 'text-charcoal-700 dark:text-charcoal-300 hover:bg-cream-100 dark:hover:bg-charcoal-900'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                  <div className="pt-4 mt-4 border-t border-cream-200 dark:border-charcoal-800">
                    <Link
                      href="/login"
                      className="block text-center py-3 px-4 rounded-xl font-semibold text-white"
                      style={{
                        background: 'linear-gradient(135deg, var(--color-forest-600) 0%, var(--color-forest-700) 100%)',
                        fontFamily: 'var(--font-body)',
                      }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Main Content */}
        <main className="flex-1 pt-20">
          {children}
        </main>

        {/* Premium Footer */}
        <footer
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, var(--color-charcoal-950) 0%, #1a1614 100%)',
            padding: '80px 0 40px',
          }}
        >
          {/* Subtle background pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M30 15c-2.5 0-4.5 1.5-6 4-1.5-2.5-3.5-4-6-4-4 0-7 3-7 7 0 2 1 4 3 5-2 1-3 3-3 5 0 4 3 7 7 7 2.5 0 4.5-1.5 6-4 1.5 2.5 3.5 4 6 4 4 0 7-3 7-7 0-2-1-4-3-5 2-1 3-3 3-5 0-4-3-7-7-7z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div
            style={{
              maxWidth: 1280,
              margin: '0 auto',
              padding: '0 32px',
              position: 'relative',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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
                    <FiHome className="text-white text-lg" />
                  </div>
                  <span
                    className="text-xl font-bold text-white"
                    style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}
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

                {/* Social Links */}
                <div style={{ display: 'flex', gap: 12 }}>
                  {[
                    { icon: FiTwitter, href: '#', label: 'Twitter' },
                    { icon: FiInstagram, href: '#', label: 'Instagram' },
                    { icon: FiLinkedin, href: '#', label: 'LinkedIn' },
                    { icon: FiFacebook, href: '#', label: 'Facebook' },
                  ].map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        color: 'var(--color-charcoal-500)',
                      }}
                    >
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--color-gold-400)',
                    marginBottom: 20,
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Explore
                </h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, listStyle: 'none', padding: 0, margin: 0 }}>
                  {[
                    { label: 'Buy', href: '/properties?type=buy' },
                    { label: 'Rent', href: '/properties?type=rent' },
                    { label: 'Sell', href: '/sell' },
                    { label: 'Agents', href: '/agents' },
                  ].map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        style={{
                          fontSize: '0.9375rem',
                          textDecoration: 'none',
                          color: 'var(--color-charcoal-500)',
                          fontFamily: 'var(--font-body)',
                          transition: 'color 200ms',
                        }}
                        onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--color-gold-400)')}
                        onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--color-charcoal-500)')}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--color-gold-400)',
                    marginBottom: 20,
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Company
                </h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, listStyle: 'none', padding: 0, margin: 0 }}>
                  {[
                    { label: 'About', href: '/about' },
                    { label: 'Contact', href: '/contact' },
                  ].map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        style={{
                          fontSize: '0.9375rem',
                          textDecoration: 'none',
                          color: 'var(--color-charcoal-500)',
                          fontFamily: 'var(--font-body)',
                          transition: 'color 200ms',
                        }}
                        onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--color-gold-400)')}
                        onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--color-charcoal-500)')}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter */}
              <div>
                <h3
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--color-gold-400)',
                    marginBottom: 20,
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Stay Updated
                </h3>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-charcoal-500)',
                    marginBottom: 16,
                    fontFamily: 'var(--font-body)',
                    lineHeight: 1.6,
                  }}
                >
                  Get the latest property listings and market insights.
                </p>
                <form
                  onSubmit={(e) => e.preventDefault()}
                  style={{ display: 'flex', gap: 8 }}
                >
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-white/10 border border-white/10 text-white placeholder:text-charcoal-600 focus:outline-none focus:border-gold-500/50 transition-colors"
                    style={{
                      fontFamily: 'var(--font-body)',
                      minWidth: 0,
                    }}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-charcoal-950 transition-all duration-200 hover:shadow-lg flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, var(--color-gold-500) 0%, var(--color-gold-600) 100%)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>

            {/* Bottom Bar */}
            <div
              style={{
                borderTop: '1px solid rgba(255,255,255,0.08)',
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
                © {new Date().getFullYear()} Scervy Peak. All rights reserved.
              </p>
              <div style={{ display: 'flex', gap: 24 }}>
                {['Privacy Policy', 'Terms of Service'].map((item) => (
                  <Link
                    key={item}
                    href="#"
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-charcoal-600)',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-body)',
                      transition: 'color 200ms',
                    }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--color-gold-400)')}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--color-charcoal-600)')}
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}