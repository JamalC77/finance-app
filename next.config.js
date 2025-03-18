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
  // Exclude specific pages from static generation
  exportPathMap: async function (defaultPathMap) {
    // Remove the api-connectivity-test page from the static export
    delete defaultPathMap['/api-connectivity-test']
    return defaultPathMap
  },
};

module.exports = nextConfig; 