import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL('http://localhost:4000/api/v1/files/**'),
      new URL('https://picsum.photos/**'),
      new URL('https://example.com/**'),
      new URL('https://img.youtube.com/**'),
    ],
  },
}

export default nextConfig
