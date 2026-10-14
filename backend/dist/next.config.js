"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nextConfig = {
    experimental: {
        agentFeedback: true,
    },
    cacheComponents: true,
    partialPrefetching: true,
    turbopack: {
        rules: {
            "*.css": {
                loaders: ["@tailwindcss/turbopack"],
                as: "*.css",
            },
        },
    },
};
exports.default = nextConfig;
//# sourceMappingURL=next.config.js.map