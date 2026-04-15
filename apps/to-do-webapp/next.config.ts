import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  serverExternalPackages: ["@pagopa/azure-tracing"],
};

export default nextConfig;
