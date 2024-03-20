/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverComponentsExternalPackages: ['mongodb'],
    },
  }
   
  module.exports = nextConfig
