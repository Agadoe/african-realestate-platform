import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  FiPlus, FiEdit, FiEye, FiTrash2, FiHome, FiUser, FiLock,
  FiHeart, FiDollarSign, FiMail, FiAlertCircle
} from 'react-icons/fi';
import PropertyListingForm from '../../components/PropertyListingForm';
import PropertyCard from '../../components/PropertyCard';
import { propertyApi } from '../../lib/api';

export default function OwnerListings() {
  const router = useRouter();
  const [listings, setListings] = useState<any[]>([]);
  const [stats, setStats] = useState({ views: 0, favorites: 0, inquiries: 0 });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (!user) {
      router.replace('/login');
      return;
    }
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await propertyApi.getOwnerListings();
      const data = res.data;

      setListings(data.properties || []);

      // Compute real stats from fetched listings
      setStats({
        views: (data.properties || []).reduce((sum: number, p: any) => sum + (p.views || 0), 0),
        favorites: (data.properties || []).reduce((sum: number, p: any) => sum + (p.favorites?.length || 0), 0),
        inquiries: (data.properties || []).reduce((sum: number, p: any) => sum + (p.inquiries || 0), 0),
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = async (property: any) => {
    try {
      const res = await propertyApi.createProperty(property);
      setListings(prev => [res.data, ...prev]);
      setShowForm(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create listing');
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (!confirm('Delete this listing? This cannot be undone.')) return;
    try {
      await propertyApi.deleteProperty(id);
      setListings(prev => prev.filter(l => l._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete listing');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Head>
          <title>Add Listing | African Real Estate Platform</title>
        </Head>
        <div className="container py-8">
          <PropertyListingForm
            onSubmit={handleCreateListing}
            onCancel={() => setShowForm(false)}
          />
        </div>
      </div>
    );
  }

  const ownerName = user
    ? `${user.firstName} ${user.lastName}`
    : 'Property Owner';
  const initials = ownerName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Head>
        <title>My Listings | African Real Estate Platform</title>
      </Head>

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="card p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-700 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-slate-500 dark:text-slate-400">
                    {initials}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {ownerName}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Property Owner
                </p>
              </div>

              <nav className="space-y-2">
                <Link href="/profile" className="flex items-center p-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                  <FiUser className="mr-3" />
                  <span>Profile</span>
                </Link>
                <Link href="/owner/listings" className="flex items-center p-3 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg">
                  <FiHome className="mr-3" />
                  <span>My Listings</span>
                </Link>
                <Link href="/profile/favorites" className="flex items-center p-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                  <FiHeart className="mr-3" />
                  <span>Favorites</span>
                </Link>
                <Link href="/profile/inquiries" className="flex items-center p-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                  <FiMail className="mr-3" />
                  <span>Inquiries</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center p-3 w-full text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  <FiLock className="mr-3" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Property Listings</h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Manage your property listings and track their performance
                </p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary flex items-center"
              >
                <FiPlus className="mr-2" />
                Add New Listing
              </button>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg flex items-center gap-2">
                <FiAlertCircle />
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <svg className="animate-spin h-12 w-12 text-primary-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="mt-4 text-slate-600 dark:text-slate-400">Loading your listings...</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6">
                  <FiHome className="text-slate-400 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  No listings yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Get started by adding your first property listing.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="btn btn-primary"
                >
                  <FiPlus className="mr-2" />
                  Add Your First Listing
                </button>
              </div>
            ) : (
              <>
                {/* Stats (real data) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="card p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                      <FiHome className="text-blue-600 dark:text-blue-400 text-xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {listings.length}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">Total Listings</p>
                  </div>

                  <div className="card p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                      <FiEye className="text-green-600 dark:text-green-400 text-xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stats.views.toLocaleString()}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">Total Views</p>
                  </div>

                  <div className="card p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
                      <FiHeart className="text-purple-600 dark:text-purple-400 text-xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stats.favorites}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">Favorites</p>
                  </div>

                  <div className="card p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-4">
                      <FiDollarSign className="text-orange-600 dark:text-orange-400 text-xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stats.inquiries}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">Inquiries</p>
                  </div>
                </div>

                {/* Listings */}
                <div className="card p-6 mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                      Your Listings
                    </h2>
                    <span className="text-slate-600 dark:text-slate-400">
                      {listings.length} {listings.length === 1 ? 'listing' : 'listings'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map((listing) => (
                      <div key={listing._id} className="card overflow-hidden">
                        <PropertyCard property={listing} />
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
                          <div className="flex justify-between items-center">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              listing.status === 'active'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                                : listing.status === 'pending'
                                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                            }`}>
                              {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                            </span>
                            <div className="flex space-x-2">
                              <Link
                                href={`/properties/${listing._id}`}
                                className="p-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400"
                              >
                                <FiEye size={16} />
                              </Link>
                              <button
                                className="p-2 text-slate-500 hover:text-red-600 dark:hover:text-red-400"
                                onClick={() => handleDeleteListing(listing._id)}
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}