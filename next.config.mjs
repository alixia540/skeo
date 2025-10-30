/** @type {import('next').NextConfig} */
const nextConfig = {
  // ⚙️ Forcer Webpack au lieu de Turbopack
  experimental: {
    turbo: {
      enabled: false,
    },
  },
  reactStrictMode: true,
};

export default nextConfig;
