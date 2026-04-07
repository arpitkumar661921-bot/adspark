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
        "localhost",
        "127.0.0.1:3000",
        "127.0.0.1"
      ]
    }
  },
  // Allow dev origins from Vercel preview environments
  allowedDevOrigins: [
    "localhost:3000",
    "localhost",
    "127.0.0.1:3000",
    "127.0.0.1"
  ]
};

export default nextConfig;
