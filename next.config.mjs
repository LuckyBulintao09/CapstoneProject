/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // domains: ["kxkkueirrfwmrrurarhw.supabase.co"], // Add your Supabase domain here --> deprecated na to
        remotePatterns: [
            {
                protocol: "https",
                hostname: "kxkkueirrfwmrrurarhw.supabase.co",
                port: "",
            },
            {
                protocol: "https",
                hostname: "picsum.photos",
                port: "",
            }
        ]
    },
};

export default nextConfig;
