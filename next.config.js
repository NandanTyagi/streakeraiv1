/** @type {import('next').NextConfig} */
const defaultRuntimeCaching = require('next-pwa/cache');
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  cacheStartUrl: false,
  dynamicStartUrl: false,
  runtimeCaching: [
    {
      // Auth, API and rendered page responses must never survive sign-out.
      urlPattern: ({ request, url }) => request.mode === 'navigate' ||
        url.pathname.startsWith('/api/') || url.pathname.startsWith('/sign-') ||
        url.pathname.startsWith('/__clerk') ||
        url.pathname.startsWith('/_next/data/') ||
        request.headers.get('RSC') === '1' ||
        url.hostname.includes('clerk'),
      handler: 'NetworkOnly',
    },
    ...defaultRuntimeCaching,
  ],
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
