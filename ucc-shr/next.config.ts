import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Skip bundling these server-only packages — use the Node.js require() path instead.
  // This dramatically reduces cold-start compile time for server components & API routes.

  serverExternalPackages: [
    '@prisma/client',
    '@prisma/adapter-pg',
    'bcryptjs',
    'cloudinary',
    'resend',
    'jspdf',
    'html2canvas',
  ],

  experimental: {
    // Only import the specific icons/components you use, not the entire library.
    // Speeds up both dev compilation and production bundle size.
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'recharts',
      '@tiptap/react',
      '@tiptap/starter-kit',
      '@tiptap/extension-image',
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
}

export default nextConfig;
