/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public', // Service worker files will go into /public
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Disable in dev mode
});

module.exports = withPWA({
  reactStrictMode: true,
});

