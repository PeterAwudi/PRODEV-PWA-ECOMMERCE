// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'source.unsplash.com', // if you still use it
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos', // <-- added this
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;



