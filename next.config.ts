import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['gsap'],
  images: {
    domains: ['res.cloudinary.com'],
  },
};

export default nextConfig;
