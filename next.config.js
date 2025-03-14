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
  reactStrictMode: false,
  swcMinify: true,
};

module.exports = nextConfig; 