import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiMapPin, FiTrendingUp, FiHome, FiDollarSign, FiShield, FiStar, FiFilter } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function NeighborhoodDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [activeTab, setActiveTab] = useState('overview');

  // In a real app, this would be fetched from an API
  const neighborhood = {
    id: 1,
    name: 'Airport Residential Area',
    city: 'Accra, Ghana',
    description: 'One of Accra\'s most prestigious neighborhoods, known for its excellent security, modern infrastructure, and proximity to international schools and hospitals. This area offers a perfect blend of tranquility and convenience.',
    image: '/placeholder-neighborhood.jpg',
    priceTrend: 8.5,
    safetyScore: 9.2,
    infrastructureScore: 9.5,
    appreciationRate: 12.3,
    propertyCount: 142,
    amenities: [
      'International Schools',
      'Private Hospitals',
      'Shopping Malls',
      '24/7 Security',
      'Gyms',
      'Restaurants',
      'Parks',
      'Embassies'
    ],
    priceHistory: [
      { year: 2020, price: 150000 },
      { year: 2021, price: 165000 },
      { year: 2022, price: 180000 },
      { year: 2023, price: 195000 },
      { year: 2024, price: 210000 }
    ],
    properties: [
      {
        id: 1,
        title: 'Luxury 3-Bedroom Apartment',
        price: 'GH₵150,000',
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        agent: 'Kwame Asante'
      },
      {
        id: 2,
        title: 'Modern 4-Bedroom Villa',
        price: 'GH₵450,000',
        bedrooms: 4,
        bathrooms: 3,
        area: 250,
        agent: 'Akosua Mensah'
      },
      {
        id: 3,
        title: 'Beachfront Property',
        price: 'GH₵650,000',
        bedrooms: 5,
        bathrooms: 4,
        area: 300,
        agent: 'Kojo Boateng'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Head>
        <title>{neighborhood.name} | African Real Estate Platform</title>
        <meta name="description" content={neighborhood.description} />
      </Head>

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <nav className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-2">
                <Link href="/">Home</Link>
                <span className="mx-2">/</span>
                <Link href="/neighborhoods">Neighborhoods</Link>
                <span className="mx-2">/</span>
                <span className="text-slate-900 dark:text-white">{neighborhood.name}</span>
              </nav>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {neighborhood.name}
              </h1>
              <div className="flex items-center text-slate-600 dark:text-slate-400 mt-1">
                <FiMapPin className="mr-2" />
                <span>{neighborhood.city}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
                <FiFilter className="mr-2" />
                Filter Properties
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-96">
        <div className="bg-slate-200 dark:bg-slate-700 w-full h-full flex items-center justify-center">
          <FiMapPin className="text-slate-400 text-6xl" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-8 left-8 right-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{neighborhood.name}</h1>
          <p className="text-xl text-slate-200 max-w-3xl">{neighborhood.description}</p>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <main className="flex-1">
            {/* Neighborhood Tabs */}
            <div className="card mb-8">
              <div className="border-b border-slate-200 dark:border-slate-700">
                <nav className="flex space-x-8 px-6">
                  {['overview', 'market-insights', 'properties'].map((tab) => (
                    <button
                      key={tab}
                      className={`py-4 px-1 font-medium text-sm border-b-2 ${
                        activeTab === tab
                          ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                          : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Neighborhood Overview</h2>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {neighborhood.description} This prestigious area is home to many expatriates and affluent locals
                        who appreciate the blend of modern amenities and peaceful residential environment. The neighborhood
                        features well-maintained roads, reliable utilities, and a strong sense of community.
                      </p>
                    </div>

                    {/* Key Metrics */}
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Key Metrics</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                            {neighborhood.priceTrend}%
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">Price Trend</div>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                            {neighborhood.safetyScore}/10
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">Safety Score</div>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                            {neighborhood.infrastructureScore}/10
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">Infrastructure</div>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                            {neighborhood.appreciationRate}%
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">Appreciation</div>
                        </div>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Amenities & Features</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {neighborhood.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-primary-500 mr-3"></div>
                            <span className="text-slate-700 dark:text-slate-300">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'market-insights' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Market Insights</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl">
                          <div className="flex items-center mb-4">
                            <FiTrendingUp className="text-blue-600 dark:text-blue-400 text-2xl mr-3" />
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Price Trend Analysis</h3>
                          </div>
                          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                            +{neighborhood.priceTrend}%
                          </p>
                          <p className="text-slate-600 dark:text-slate-400">
                            Annual property value increase over the past 5 years
                          </p>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl">
                          <div className="flex items-center mb-4">
                            <FiDollarSign className="text-green-600 dark:text-green-400 text-2xl mr-3" />
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Rental Yield</h3>
                          </div>
                          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                            8.5%
                          </p>
                          <p className="text-slate-600 dark:text-slate-400">
                            Average rental yield for properties in this area
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Price History Chart */}
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Price History (Last 5 Years)</h2>
                      <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-end justify-between px-8 py-6">
                        {neighborhood.priceHistory.map((data, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div
                              className="w-8 bg-primary-600 dark:bg-primary-500 rounded-t"
                              style={{ height: `${(data.price / 250000) * 100}%` }}
                            ></div>
                            <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">{data.year}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-500">
                              {data.price.toLocaleString('en-GH', { style: 'currency', currency: 'GHS' })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Investment Analysis */}
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Investment Analysis</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                          <h3 className="font-medium text-slate-900 dark:text-white mb-2">Capital Growth</h3>
                          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                            +{neighborhood.appreciationRate}%
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            Annual average appreciation
                          </p>
                        </div>
                        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                          <h3 className="font-medium text-slate-900 dark:text-white mb-2">Rental Demand</h3>
                          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                            High
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          Strong tenant interest
                          </p>
                        </div>
                        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                          <h3 className="font-medium text-slate-900 dark:text-white mb-2">Risk Level</h3>
                          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                            Low
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            Stable market conditions
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'properties' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                        Properties in {neighborhood.name}
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400">
                        {neighborhood.propertyCount} properties available
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {neighborhood.properties.map((property) => (
                        <div key={property.id} className="card overflow-hidden">
                          <div className="relative h-48">
                            <div className="bg-slate-200 dark:bg-slate-700 w-full h-full flex items-center justify-center">
                              <FiHome className="text-slate-400 text-3xl" />
                            </div>
                            <div className="absolute bottom-2 right-2 bg-white dark:bg-slate-900 px-2 py-1 rounded text-xs font-medium">
                              {property.price}
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium text-slate-900 dark:text-white mb-1">
                              {property.title}
                            </h3>
                            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-3">
                              <span>{property.bedrooms} beds</span>
                              <span>{property.bathrooms} baths</span>
                              <span>{property.area} m²</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                Agent: {property.agent}
                              </span>
                              <button className="btn btn-primary text-sm px-3 py-1">
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center mt-8">
                      <button className="btn btn-outline">
                        Load More Properties
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="card sticky top-24">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Neighborhood Stats</h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Safety</span>
                      <span className="font-medium text-slate-900 dark:text-white">{neighborhood.safetyScore}/10</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${neighborhood.safetyScore * 10}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Infrastructure</span>
                      <span className="font-medium text-slate-900 dark:text-white">{neighborhood.infrastructureScore}/10</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${neighborhood.infrastructureScore * 10}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Price Stability</span>
                      <span className="font-medium text-slate-900 dark:text-white">8.2/10</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: '82%' }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full btn btn-primary">
                      Search Properties
                    </button>
                    <button className="w-full btn btn-outline">
                      Schedule Viewing
                    </button>
                    <button className="w-full btn btn-outline">
                      Get Market Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}