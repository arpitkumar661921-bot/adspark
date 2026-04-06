import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.pollinations.ai"
      }
    ]
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "*.vercel.app",
        "*.vusercontent.net",
        "*.vercel.run"
      ]
    }
  },
  allowedDevOrigins: [
    "localhost:3000",
    "*.vercel.app",
    "*.vusercontent.net",
    "*.vercel.run"
  ]
};

export default nextConfig;
