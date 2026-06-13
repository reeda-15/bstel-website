import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/assets/**",
      },
      {
        pathname: "/project-logos/**",
      },
    ],
  },
};

export default nextConfig;
