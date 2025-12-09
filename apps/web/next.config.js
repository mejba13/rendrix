/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@rendrix/types', '@rendrix/utils'],
  images: {
    domains: ['localhost', 'rendrix.com'],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
