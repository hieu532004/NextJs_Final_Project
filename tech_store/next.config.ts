import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'readdy.ai',
        port: '',
        pathname: '/api/search-image/**',
      },
      {
        protocol: 'https',
        hostname: 'jobsgo.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.ellisbates.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.tgdd.vn',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'th.bing.com',
      },
      {
        protocol: 'https',
        hostname: 'mega.com.vn',
      },
      {
        protocol: 'https',
        hostname: 'urbancrypto.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
      {
        protocol: 'https',
        hostname: 'www.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.freepik.com',
      },
    ],
  },
};

export default nextConfig;
