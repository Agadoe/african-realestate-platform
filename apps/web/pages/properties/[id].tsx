import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiMapPin, FiHeart, FiShare2, FiPhone, FiMail, FiCalendar, FiDollarSign, FiHome, FiMaximize, FiDroplet, FiChevronLeft, FiChevronRight, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { propertyApi } from '../../lib/api';

interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  propertyType: string;
  listingType: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: string;
  yearBuilt: number;
  condition: string;
  status: string;
  views: number;
  inquiries: number;
  createdAt?: string;
  updatedAt?: string;
  features: string[];
  amenities: string[];
  images: Array<{ url: string; caption?: string }>;
  address: { street: string; city: string; region: string; country: string };
  agentId?: { firstName: string; lastName: string; email?: string; phone?: string; agencyName?: string; rating?: number };
  ownerId?: { firstName: string; lastName: string; phone?: string };
  neighborhoodId?: { name: string; description?: string; priceTrends?: string };
}

export default function PropertyDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProperty = async () => {
      setLoading(true);
      setError('');
      try {
        const response: { data: Property } = await propertyApi.getProperty(id as string);
        setProperty(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load property');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Format price
  const formatPrice = (price: number, currency: string) => {
    const symbol = currency === 'GHS' ? 'GH₵' : currency === 'USD' ? '$' : '€';
    if (price >= 1000000) return `${symbol}${(price / 1000000).toFixed(1)}M`;
    if (price >= 1000) return `${symbol}${(price / 1000).toFixed(0)}k`;
    return `${symbol}${price.toLocaleString()}`;
  };

  // Get listing type label
  const getListingTypeLabel = (type: string) => {
    switch (type) {
      case 'sale': return 'For Sale';
      case 'rent': return 'For Rent';
      case 'rent-to-own': return 'Rent to Own';
      default: return type;
    }
  };

  // Next/prev image
  const nextImage = () => {
    if (!property?.images?.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    if (!property?.images?.length) return;
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  // Share property
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.title,
          text: `Check out this property: ${property?.title}`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="container py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded-xl mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
              <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <FiHome className="mx-auto text-5xl text-slate-300 dark:text-slate-600 mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {error || 'Property not found'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/properties" className="btn btn-primary">
            Browse Properties
          </Link>
        </div>
      </div>
    );
  }

  const images = property.images?.length > 0 ? property.images : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Head>
        <title>{property.title} | Scervy Peak</title>
        <meta name="description" content={property.description?.substring(0, 160)} />
        {/* Open Graph */}
        <meta property="og:title" content={`${property.title} — ${property.address?.city}, ${property.address?.region}`} />
        <meta property="og:description" content={property.description?.substring(0, 160)} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://web-ffulrcu5y-baahe.vercel.app/properties/${property._id}`} />
        {images[0] && <meta property="og:image" content={images[0].url} />}
        <meta property="og:site_name" content="Scervy Peak" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${property.title} | Scervy Peak`} />
        <meta name="twitter:description" content={property.description?.substring(0, 160)} />
        {images[0] && <meta name="twitter:image" content={images[0].url} />}
        <link rel="canonical" href={`https://web-ffulrcu5y-baahe.vercel.app/properties/${property._id}`} />
      </Head>

      {/* JSON-LD Schema.org — RealEstateListing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "RealEstateListing",
          "name": property.title,
          "description": property.description,
          "url": `https://web-ffulrcu5y-baahe.vercel.app/properties/${property._id}`,
          "image": images[0]?.url,
          "price": property.price,
          "priceCurrency": property.currency === 'GHS' ? 'GHS' : property.currency === 'USD' ? 'USD' : 'EUR',
          "address": {
            "@type": "PostalAddress",
            "streetAddress": property.address?.street,
            "addressLocality": property.address?.city,
            "addressRegion": property.address?.region,
            "addressCountry": property.address?.country
          },
          "numberOfBedrooms": property.bedrooms,
          "numberOfBathrooms": property.bathrooms,
          "floorSize": { "@type": "QuantitativeValue", "value": property.area, "unitCode": property.areaUnit === 'sqft' ? 'FTK' : 'MTK' },
          "geo": undefined,
          "listingType": property.listingType === 'sale' ? 'For Sale' : property.listingType === 'rent' ? 'For Rent' : 'Rent to Own',
          "keywords": [property.propertyType, property.listingType, property.address?.city].filter(Boolean).join(', ')
        }, null, 2) }}
      />

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="container py-3">
          <nav className="flex items-center text-sm text-slate-600 dark:text-slate-400">
            <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/properties" className="hover:text-primary-600 dark:hover:text-primary-400">Properties</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-900 dark:text-white line-clamp-1">{property.title}</span>
          </nav>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative bg-slate-900">
        {images.length > 0 ? (
          <>
            <div
              className="h-96 md:h-[500px] cursor-pointer"
              onClick={() => setShowGallery(true)}
            >
              <img
                src={images[currentImageIndex].url}
                alt={`${property.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </div>

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 dark:bg-slate-900/90 rounded-full hover:bg-white dark:hover:bg-slate-900 transition-colors"
                >
                  <FiChevronLeft className="text-slate-800 dark:text-white" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 dark:bg-slate-900/90 rounded-full hover:bg-white dark:hover:bg-slate-900 transition-colors"
                >
                  <FiChevronRight className="text-slate-800 dark:text-white" />
                </button>

                {/* Thumbnails */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                <div className="absolute top-4 right-4 flex space-x-2">
                  <span className="px-3 py-1 bg-black/70 text-white text-sm rounded-full">
                    {currentImageIndex + 1} / {images.length}
                  </span>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="h-96 flex items-center justify-center bg-slate-800">
            <FiHome className="text-6xl text-slate-600" />
          </div>
        )}

        {/* Actions */}
        <div className="absolute top-4 left-4 flex space-x-2">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-3 bg-white/90 dark:bg-slate-900/90 rounded-full hover:bg-white dark:hover:bg-slate-900 transition-colors"
          >
            <FiHeart className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-slate-800 dark:text-white'}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-3 bg-white/90 dark:bg-slate-900/90 rounded-full hover:bg-white dark:hover:bg-slate-900 transition-colors"
          >
            <FiShare2 className="w-5 h-5 text-slate-800 dark:text-white" />
          </button>
        </div>
      </div>

      {/* Gallery Modal */}
      {showGallery && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setShowGallery(false)}
        >
          <button
            className="absolute top-4 right-4 p-3 text-white hover:text-slate-300"
            onClick={() => setShowGallery(false)}
          >
            ✕
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 p-3 text-white hover:text-slate-300"
          >
            <FiChevronLeft className="w-8 h-8" />
          </button>
          <img
            src={images[currentImageIndex]?.url}
            alt={`${property.title} - Image ${currentImageIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 p-3 text-white hover:text-slate-300"
          >
            <FiChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 text-sm font-medium rounded-full mb-2">
                    {getListingTypeLabel(property.listingType)}
                  </span>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-slate-600 dark:text-slate-400">
                    <FiMapPin className="mr-2" />
                    <span>
                      {[property.address?.street, property.address?.city, property.address?.region, property.address?.country].filter(Boolean).join(', ')}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {formatPrice(property.price, property.currency)}
                    {property.listingType === 'rent' && <span className="text-lg">/mo</span>}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                    {property.propertyType} · {property.condition}
                  </p>
                </div>
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-4 gap-4 py-4 border-t border-slate-100 dark:border-slate-700">
                {property.bedrooms > 0 && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{property.bedrooms}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Bedrooms</p>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{property.bathrooms}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Bathrooms</p>
                  </div>
                )}
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{property.area}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{property.areaUnit || 'sqm'}</p>
                </div>
                {property.yearBuilt && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{property.yearBuilt}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Year Built</p>
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-2 py-3 border-t border-slate-100 dark:border-slate-700">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs font-semibold rounded-full border border-green-200 dark:border-green-800">
                  <FiCheck size={12} /> Verified Property
                </span>
                {property.ownerId ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs font-semibold rounded-full border border-blue-200 dark:border-blue-800">
                    <FiHome size={12} /> Owner Listed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs font-semibold rounded-full border border-purple-200 dark:border-purple-800">
                    <FiHome size={12} /> Agent Listed
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-full border border-slate-200 dark:border-slate-700">
                  <FiCalendar size={12} /> {property.views || 0} views
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-full border border-slate-200 dark:border-slate-700">
                  <FiCalendar size={12} /> Listed {property.createdAt ? new Date(property.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'recently'}
                </span>
              </div>

              {/* Views & Inquiries */}
              <div className="flex space-x-6 text-sm text-slate-600 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-700">
                <span>{property.inquiries || 0} inquiries</span>
                <span className="capitalize px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded text-xs">
                  {property.status}</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="card overflow-hidden">
              <div className="flex border-b border-slate-200 dark:border-slate-700">
                {['overview', 'features', 'amenities'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 text-sm font-medium capitalize transition-colors ${
                      activeTab === tab
                        ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Description</h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                      {property.description}
                    </p>

                    {property.neighborhoodId?.name && (
                      <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                          📍 {property.neighborhoodId.name}
                        </h3>
                        {property.neighborhoodId.description && (
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {property.neighborhoodId.description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'features' && property.features?.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Property Features</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-slate-700 dark:text-slate-300">
                          <FiCheck className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'amenities' && property.amenities?.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Amenities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center text-slate-700 dark:text-slate-300">
                          <FiCheck className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {((activeTab === 'features' && !property.features?.length) ||
                  (activeTab === 'amenities' && !property.amenities?.length)) && (
                  <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                    No {activeTab} listed for this property.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                {property.agentId ? 'Contact Agent' : 'Contact Owner'}
              </h3>

              {property.agentId && (
                <>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {property.agentId.firstName?.[0]}{property.agentId.lastName?.[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {property.agentId.firstName} {property.agentId.lastName}
                      </p>
                      {property.agentId.agencyName && (
                        <p className="text-sm text-slate-600 dark:text-slate-400">{property.agentId.agencyName}</p>
                      )}
                      {property.agentId.rating && (
                        <div className="flex items-center text-sm text-yellow-500">
                          ★ {property.agentId.rating.toFixed(1)}
                        </div>
                      )}
                    </div>
                  </div>

                  {property.agentId.phone && (
                    <a
                      href={`tel:${property.agentId.phone}`}
                      className="flex items-center justify-center w-full py-3 mb-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                    >
                      <FiPhone className="mr-2" /> Call Agent
                    </a>
                  )}
                  {property.agentId.email && (
                    <a
                      href={`mailto:${property.agentId.email}`}
                      className="flex items-center justify-center w-full py-3 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      <FiMail className="mr-2" /> Send Email
                    </a>
                  )}
                </>
              )}

              {property.ownerId && (
                <>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        {property.ownerId.firstName?.[0]}{property.ownerId.lastName?.[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {property.ownerId.firstName} {property.ownerId.lastName}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Property Owner</p>
                    </div>
                  </div>

                  {property.ownerId.phone && (
                    <a
                      href={`tel:${property.ownerId.phone}`}
                      className="flex items-center justify-center w-full py-3 mb-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                    >
                      <FiPhone className="mr-2" /> Call Owner
                    </a>
                  )}
                </>
              )}

              {!property.agentId && !property.ownerId && (
                <p className="text-slate-500 dark:text-slate-400 text-center py-4">
                  No contact information available.
                </p>
              )}
            </div>

            {/* Inquiry Form */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Send Inquiry</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Inquiry submitted! (Email integration pending)');
                }}
                className="space-y-4"
              >
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  className="input w-full"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  className="input w-full"
                />
                <input
                  type="tel"
                  placeholder="Your Phone"
                  className="input w-full"
                />
                <textarea
                  placeholder={`I'm interested in ${property.title}...`}
                  rows={4}
                  required
                  className="input w-full"
                />
                <button type="submit" className="w-full btn btn-primary">
                  Send Inquiry
                </button>
              </form>
            </div>

            {/* Back to Listings */}
            <Link href="/properties" className="flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 py-2">
              <FiChevronLeft className="mr-1" /> Back to Properties
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}