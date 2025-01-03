/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com','media.licdn.com','gravatar.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['mongodb'],
  },
  // Any other Next.js config options
};

module.exports = withPWA(nextConfig);






// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: ['lh3.googleusercontent.com'],
//   },
//     experimental: {
//       serverComponentsExternalPackages: ['mongodb'],
//     },
//   }
   
//   module.exports = nextConfig
