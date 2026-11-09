import type { NextConfig } from "next";
import path from "node:path";

const projectRoot = process.cwd();

const nextConfig: NextConfig = {
    outputFileTracingRoot: projectRoot,

    turbopack: {
        root: projectRoot,
        rules: {
            "*.css": {
                loaders: ["@tailwindcss/turbopack"],
                as: "*.css",
            },
        },
    },
};

export default nextConfig;