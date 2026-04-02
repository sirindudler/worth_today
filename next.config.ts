import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/worth_today",
  images: { unoptimized: true },
};

export default nextConfig;
