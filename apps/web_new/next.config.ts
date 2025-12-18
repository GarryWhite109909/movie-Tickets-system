import type { NextConfig } from "next";

type NextRemotePattern = {
  protocol: 'http' | 'https';
  hostname: string;
  port?: string;
  pathname: string;
};

function getBackendRemotePattern(): NextRemotePattern {
  const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';
  let base = raw;
  try {
    const u = new URL(raw);
    if (u.pathname.endsWith('/api')) {
      u.pathname = u.pathname.slice(0, -4) || '/';
    }
    base = u.toString();
  } catch {
    base = 'http://localhost:3003';
  }

  try {
    const u = new URL(base);
    const protocol: 'http' | 'https' = u.protocol === 'https:' ? 'https' : 'http';
    const pattern: NextRemotePattern = {
      protocol,
      hostname: u.hostname,
      pathname: '/**',
    };
    if (u.port) pattern.port = u.port;
    return pattern;
  } catch {
    return {
      protocol: 'http',
      hostname: 'localhost',
      port: '3003',
      pathname: '/**',
    };
  }
}

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/7.x/**',
      },
      getBackendRemotePattern(),
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3003',
        pathname: '/uploads/**',
      },
       {
        protocol: 'http',
        hostname: 'localhost',
        port: '3003',
        pathname: '/avatar/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3003/api/:path*', // Proxy to Backend
      },
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:3003/uploads/:path*',
      },
      {
        source: '/avatar/:path*',
        destination: 'http://localhost:3003/avatar/:path*',
      },
    ];
  },
};

export default nextConfig;
