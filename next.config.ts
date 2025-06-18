import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL('https://api.coursity.io.vn/api/v1/files/**'),
      new URL('https://img.youtube.com/**'),
    ],
  },
}

export default nextConfig
