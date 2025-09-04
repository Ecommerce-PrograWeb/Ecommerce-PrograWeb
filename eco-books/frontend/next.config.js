/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['cdn-icons-png.flaticon.com'],
    unoptimized: true,
  }
}

module.exports = nextConfig