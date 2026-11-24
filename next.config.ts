import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Capturas de proyectos subidas a Vercel Blob
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
};

export default nextConfig;
