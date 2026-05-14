/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com', 'placehold.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    appDir: false, // Using pages directory for now
  },
  // Optimize for African markets with slower connections
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  // Enable compression
  compress: true,
  // Optimize fonts
  optimizeFonts: true,
}

module.exports = nextConfig