/** @type {import('next').NextConfig} */
const locales = ["en"];

// Env vars copied straight out of .env can arrive wrapped in quotes; strip them
// and fall back to a supported locale so an unexpected value cannot fail the build.
const appLang = (process.env.NEXT_PUBLIC_APP_LANG || "en").trim().replace(/^["']|["']$/g, "");

const nextConfig = {
  reactStrictMode: false, // iff true then components renders twices
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    esmExternals: false,
  },
  i18n: {
    locales,
    defaultLocale: locales.includes(appLang) ? appLang : locales[0],
    localeDetection: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

module.exports = nextConfig;
