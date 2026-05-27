/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // iff true then components renders twices
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: process.env.NEXT_PUBLIC_APP_LANG || "en",
    localeDetection: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

module.exports = nextConfig;
