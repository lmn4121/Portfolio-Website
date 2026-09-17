import type { NextConfig } from "next";

const TWIN_ORIGIN = (
  process.env.TWIN_API_URL ||
  process.env.NEXT_PUBLIC_TWIN_API_URL ||
  "https://digital-twin-69dv.onrender.com"
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // Same-origin fallback if a future twin host tightens CORS.
    // The widget talks to NEXT_PUBLIC_TWIN_API_URL directly by default
    // (the live Gradio host already reflects Vercel origins).
    return [
      {
        source: "/twin-proxy/:path*",
        destination: `${TWIN_ORIGIN}/:path*`,
      },
    ];
  },
};

export default nextConfig;
