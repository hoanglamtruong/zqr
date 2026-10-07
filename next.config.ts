import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  // App Router has no pages/_app entry for next-pwa to patch, so its
  // auto-injected register script never loads — register manually instead
  // (see src/components/RegisterServiceWorker.tsx).
  register: false,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  output: "standalone",
};

export default withPWA(nextConfig);
