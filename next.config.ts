import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  swcMinify: true,
  experimental: {
  },
  images: {
    unoptimized: true,
    domains: ["localhost"]
  }
};

export default nextConfig;
