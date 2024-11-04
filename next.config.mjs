// next.config.js or next.config.mjs
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,  // Disables TypeScript errors during build
    },
    eslint: {
        ignoreDuringBuilds: true,  // Disables ESLint errors during build
    },
    images: {
        // domains: ["kxkkueirrfwmrrurarhw.supabase.co"], // Add your Supabase domain here --> deprecated na to
        remotePatterns: [
            {
                protocol: "https",
                hostname: "kxkkueirrfwmrrurarhw.supabase.co",
            },
            {
                protocol: "https",
                hostname: "picsum.photos",
            }
        ]
    }
};

export default nextConfig;
