import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@paddle/shared", "@paddle/db"],
};

export default nextConfig;
