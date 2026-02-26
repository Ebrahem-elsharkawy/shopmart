import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ecommerce.routemisr.com",
        pathname: "/**", // ✅ allow all paths
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;