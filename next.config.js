/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
    experimental: {
      serverComponentsExternalPackages: ['mongodb'],
    },
  }
   
  module.exports = nextConfig
