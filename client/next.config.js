/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: { domains: ['res.cloudinary.com'] },
    async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: 'http://127.0.0.1:5328/api/:path*', // Proxy to Backend
          },
        ]
      },
};

module.exports = nextConfig;
