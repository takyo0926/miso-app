/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cohhjfkdagidngaovdhy.supabase.co',
      },
    ],
  },
};

export default nextConfig;
