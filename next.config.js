/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript checking during builds as well
    ignoreBuildErrors: true,
  },
  // Disable React strict mode for more lenient rendering
  reactStrictMode: true,
  swcMinify: true,
  
  // Configure static generation
  experimental: {
    // Enable static generation for app directory
    appDir: true,
  },
  
  // Configure redirects at the Next.js level
  async redirects() {
    return [
      {
        source: '/api-connectivity-test',
        destination: '/api-test',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig; 