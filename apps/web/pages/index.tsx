import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiSearch, FiHome, FiUser, FiHeart, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <Head>
        <title>African Real Estate Platform | Premium Property Listings</title>
        <meta name="description" content="Discover premium properties across Africa with our world-class real estate platform. Mobile-first, AI-powered search, and secure transactions." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center">
              <FiHome className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">African<span className="text-primary-600">RealEstate</span></span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium">Properties</Link>
            <Link href="/agents" className="text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium">Agents</Link>
            <Link href="/neighborhoods" className="text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium">Neighborhoods</Link>
            <Link href="/about" className="text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium">About</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              <FiHeart className="text-slate-700 dark:text-slate-300 text-xl" />
            </button>
            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              <FiUser className="text-slate-700 dark:text-slate-300 text-xl" />
            </button>
            <button className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              <svg className="w-6 h-6 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Find Your Dream Property in Africa
            </motion.h1>
            <motion.p
              className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Premium properties, verified agents, and secure transactions. Experience the future of African real estate.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-2 flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-xl" />
                  <input
                    type="text"
                    placeholder="Search by location, property type..."
                    className="w-full pl-12 pr-4 py-4 bg-transparent border-none focus:outline-none text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                  />
                </div>
                <button className="btn btn-primary px-8 py-4 rounded-xl whitespace-nowrap">
                  Search Properties
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-800/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Why Choose Our Platform
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Built for the African market with cutting-edge technology and premium user experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="card p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-6">
                  <div className="text-2xl text-primary-600 dark:text-primary-400">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Featured Properties
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Handpicked premium listings across Africa
              </p>
            </div>
            <Link href="/properties" className="btn btn-outline">
              View All Properties
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property, index) => (
              <motion.div
                key={property.id}
                className="card overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <div className="relative h-64">
                  <div className="bg-slate-200 dark:bg-slate-700 w-full h-full flex items-center justify-center">
                    <FiHome className="text-slate-400 text-4xl" />
                  </div>
                  <div className="absolute top-4 right-4 bg-white dark:bg-slate-900 px-3 py-1 rounded-full text-sm font-medium">
                    {property.price}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    {property.title}
                  </h3>
                  <div className="flex items-center text-slate-600 dark:text-slate-400 mb-4">
                    <FiMapPin className="mr-2" />
                    <span>{property.location}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-4">
                    <span>{property.bedrooms} beds</span>
                    <span>{property.bathrooms} baths</span>
                    <span>{property.area} m²</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mr-3">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {property.agent.rating}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white text-sm">
                          {property.agent.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Verified Agent
                        </p>
                      </div>
                    </div>
                    <button className="btn btn-primary text-sm px-4 py-2">
                      Inquire
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Find Your Perfect Property?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied buyers and verified agents on our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn bg-white text-primary-600 hover:bg-slate-100 px-8 py-4 rounded-xl font-medium">
                Browse Properties
              </button>
              <button className="btn bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl font-medium">
                Become an Agent
              </button>
            </div>
          </div>
        </div>
      </section>

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
                  <FiPhone />
                </a>
                <a href="#" className="text-slate-400 hover:text-white">
                  <FiMail />
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
                  <FiMapPin className="mr-3 mt-1 flex-shrink-0" />
                  <span>123 Real Estate Avenue, Accra, Ghana</span>
                </li>
                <li className="flex items-center">
                  <FiPhone className="mr-3" />
                  <span>+233 123 456 789</span>
                </li>
                <li className="flex items-center">
                  <FiMail className="mr-3" />
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
  );
}

const features = [
  {
    icon: '📱',
    title: 'Mobile First',
    description: 'Optimized for Africa\'s mobile-first internet usage with offline support.'
  },
  {
    icon: '🤖',
    title: 'AI Powered',
    description: 'Semantic search and personalized recommendations using advanced AI.'
  },
  {
    icon: '🔒',
    title: 'High Trust',
    description: 'Verified agents, secure escrow, and fraud prevention systems.'
  },
  {
    icon: '⚡',
    title: 'Lightning Fast',
    description: 'Optimized for low-bandwidth connections with <1.5s load times.'
  }
];

const properties = [
  {
    id: 1,
    title: 'Luxury 3-Bedroom Apartment',
    price: 'GH₵150,000',
    location: 'Airport Residential Area, Accra',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    agent: {
      name: 'Kwame Asante',
      rating: 4.8
    }
  },
  {
    id: 2,
    title: 'Modern 4-Bedroom Villa',
    price: 'GH₵450,000',
    location: 'East Legon, Accra',
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    agent: {
      name: 'Akosua Mensah',
      rating: 4.9
    }
  },
  {
    id: 3,
    title: 'Beachfront Property',
    price: 'GH₵650,000',
    location: 'Labadi, Accra',
    bedrooms: 5,
    bathrooms: 4,
    area: 300,
    agent: {
      name: 'Kojo Boateng',
      rating: 4.7
    }
  }
];