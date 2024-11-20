import { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // If it's not a server-side build, tell Webpack to ignore `tls`
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        tls: false,  // This tells Webpack to ignore the `tls` module on the client-side
      };
    }
    
    // Optional: If you are using any other modules that need to be ignored in the browser, you can add them here
    return config;
  },
};

export default nextConfig;
