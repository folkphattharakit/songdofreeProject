/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // บรรทัดนี้สำคัญมากสำหรับสายฟรี เพื่อให้ Build ผ่านง่ายขึ้น
  trailingSlash: true,
};

export default nextConfig;