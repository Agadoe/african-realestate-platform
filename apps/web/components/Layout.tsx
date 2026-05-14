import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiHome, FiSearch, FiUser, FiHeart, FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';

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

      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
          <div className="container flex items-center justify-between py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center">
                <FiHome className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">African<span className="text-primary-600">RealEstate</span></span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-medium transition-colors ${
                    router.pathname === item.href
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <FiSun className="text-slate-700 dark:text-slate-300" /> : <FiMoon className="text-slate-700 dark:text-slate-300" />}
              </button>

              <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hidden md:block">
                <FiHeart className="text-slate-700 dark:text-slate-300 text-xl" />
              </button>

              <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hidden md:block">
                <FiUser className="text-slate-700 dark:text-slate-300 text-xl" />
              </button>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <FiX className="text-slate-700 dark:text-slate-300 text-xl" /> : <FiMenu className="text-slate-700 dark:text-slate-300 text-xl" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
              <div className="container py-4 space-y-3">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block py-2 font-medium transition-colors ${
                      router.pathname === item.href
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Link href="/favorites" className="block py-2 text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400">
                    Saved Properties
                  </Link>
                  <Link href="/account" className="block py-2 text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400">
                    My Account
                  </Link>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="flex-1 pt-20">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-300 py-16">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              <div>
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center">
                    <FiHome className="text-white text-xl" />
                  </div>
                  <span className="text-xl font-bold text-white">African<span className="text-primary-400">RealEstate</span></span>
                </div>
                <p className="mb-6">
                  Premium real estate platform for the African market with cutting-edge technology.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-slate-400 hover:text-white">
                    <FiUser />
                  </a>
                  <a href="#" className="text-slate-400 hover:text-white">
                    <FiHeart />
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold text-lg mb-6">Quick Links</h3>
                <ul className="space-y-3">
                  <li><Link href="/properties" className="hover:text-white transition-colors">Properties</Link></li>
                  <li><Link href="/agents" className="hover:text-white transition-colors">Agents</Link></li>
                  <li><Link href="/neighborhoods" className="hover:text-white transition-colors">Neighborhoods</Link></li>
                  <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold text-lg mb-6">Services</h3>
                <ul className="space-y-3">
                  <li><Link href="/buy" className="hover:text-white transition-colors">Buy Property</Link></li>
                  <li><Link href="/rent" className="hover:text-white transition-colors">Rent Property</Link></li>
                  <li><Link href="/sell" className="hover:text-white transition-colors">Sell Property</Link></li>
                  <li><Link href="/agents" className="hover:text-white transition-colors">Find an Agent</Link></li>
                  <li><Link href="/market" className="hover:text-white transition-colors">Market Insights</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold text-lg mb-6">Contact Info</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <FiHome className="mr-3 mt-1 flex-shrink-0" />
                    <span>123 Real Estate Avenue, Accra, Ghana</span>
                  </li>
                  <li className="flex items-center">
                    <FiUser className="mr-3" />
                    <span>+233 123 456 789</span>
                  </li>
                  <li className="flex items-center">
                    <FiHeart className="mr-3" />
                    <span>info@africanrealestate.com</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-500">
              <p>&copy; {new Date().getFullYear()} African Real Estate Platform. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}