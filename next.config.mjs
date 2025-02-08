
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Increase the memory limit
    config.performance = {
      ...config.performance,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    };
    
      if (!isServer) {
        config.plugins.push(new BundleAnalyzerPlugin());
      }
      
    
    // Optimize the build process
    config.optimization = {
      ...config.optimization,
      minimize: true,
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        cacheGroups: {
          // vendor: {
          //   test: /[\\/]node_modules[\\/]/,
          //   name(module) {
          //     const match = module.context ? module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/) : null;
          //     const packageName = match ? match[1] : 'unknown';
              
          //     return `npm.${packageName.replace('@', '')}`;
          //   },
          // },
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
          }
        },
      },
    };

    return config;
  },
   // Reduce build output size
   output: 'standalone',
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default nextConfig
