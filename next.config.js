/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: { domains: ['res.cloudinary.com'] },
    experimental: {
        esmExternals: true,
    },
    // transpilePackages: ['axios'],
    rewrites: async () => {
        return [
        {
            source: '/api/:path*',
            destination:
            process.env.NODE_ENV === 'development'
                ? 'http://127.0.0.1:5328/api/:path*'
                : '/api/',
        },
        ]
    },
}

module.exports = nextConfig
