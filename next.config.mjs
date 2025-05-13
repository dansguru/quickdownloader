/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Static export configuration
  distDir: 'out',
  // Ensure APK files are copied to the output directory
  assetPrefix: '/',
};

export default nextConfig;
