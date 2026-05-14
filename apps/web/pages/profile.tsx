import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiHome, FiStar, FiHeart, FiCalendar } from 'react-icons/fi';
import { userApi } from '../lib/api';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setFormData({
            firstName: parsedUser.firstName,
            lastName: parsedUser.lastName,
            email: parsedUser.email,
            phone: parsedUser.phone,
            address: parsedUser.address || '',
          });
        } else {
          // Redirect to login if no user data
          router.push('/login');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await userApi.updateProfile(user.id, formData);
      const updatedUser = response.data;

      // Update local storage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
      console.error('Profile update error:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-primary-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Head>
        <title>Profile | African Real Estate Platform</title>
        <meta name="description" content="Manage your African Real Estate Platform profile" />
      </Head>

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="card p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-700 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-slate-500 dark:text-slate-400">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {user?.role === 'agent' ? 'Real Estate Agent' : 'Property Buyer'}
                </p>
              </div>

              <nav className="space-y-2">
                <Link href="/profile" className="flex items-center p-3 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg">
                  <FiUser className="mr-3" />
                  <span>Profile</span>
                </Link>
                <Link href="/profile/favorites" className="flex items-center p-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                  <FiHeart className="mr-3" />
                  <span>Favorites</span>
                </Link>
                <Link href="/profile/inquiries" className="flex items-center p-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                  <FiMail className="mr-3" />
                  <span>Inquiries</span>
                </Link>
                <Link href="/profile/viewings" className="flex items-center p-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                  <FiCalendar className="mr-3" />
                  <span>Viewings</span>
                </Link>
                {user?.role === 'agent' && (
                  <Link href="/profile/listings" className="flex items-center p-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                    <FiHome className="mr-3" />
                    <span>My Listings</span>
                  </Link>
                )}
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
            <div className="card p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile Information</h1>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="btn btn-outline"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditing(false)}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="btn btn-primary"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-6 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">
                  {success}
                </div>
              )}

              {editing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        First Name
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          className="input pl-10 py-3 w-full"
                          value={formData.firstName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Last Name
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                          className="input pl-10 py-3 w-full"
                          value={formData.lastName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="input pl-10 py-3 w-full"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        className="input pl-10 py-3 w-full"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Address
                    </label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input
                        id="address"
                        name="address"
                        type="text"
                        className="input pl-10 py-3 w-full"
                        placeholder="Your full address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">First Name</h3>
                      <p className="text-slate-900 dark:text-white">{user?.firstName}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Last Name</h3>
                      <p className="text-slate-900 dark:text-white">{user?.lastName}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Email Address</h3>
                    <p className="text-slate-900 dark:text-white">{user?.email}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Phone Number</h3>
                    <p className="text-slate-900 dark:text-white">{user?.phone || 'Not provided'}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Address</h3>
                    <p className="text-slate-900 dark:text-white">{user?.address || 'Not provided'}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Member Since</h3>
                    <p className="text-slate-900 dark:text-white">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                  <FiHeart className="text-blue-600 dark:text-blue-400 text-xl" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">12</h3>
                <p className="text-slate-600 dark:text-slate-400">Saved Properties</p>
              </div>

              <div className="card p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                  <FiMail className="text-green-600 dark:text-green-400 text-xl" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">8</h3>
                <p className="text-slate-600 dark:text-slate-400">Inquiries Sent</p>
              </div>

              <div className="card p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
                  <FiStar className="text-purple-600 dark:text-purple-400 text-xl" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">4.2</h3>
                <p className="text-slate-600 dark:text-slate-400">User Rating</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}