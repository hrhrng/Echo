import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'export',  // 设置导出为静态文件
    images: {
        unoptimized: true  // 如果使用了 next/image
    }
};

export default nextConfig;
