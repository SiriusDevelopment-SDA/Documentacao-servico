import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // DESABILITA O DOBRAR RENDER DO REACT
  reactCompiler: true,
  output: "standalone",
};

export default nextConfig;
