import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img.clerk.com',
            },

            {
                protocol:"https",
                hostname:"rbbledyzkbpbjeupguvy.supabase.co",
            }
        ],
    },
};

export default nextConfig;
