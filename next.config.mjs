import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const config = {
  // Disable SWC minification to avoid Unicode issues with emoji flags
  // (react-international-phone and other packages use emoji country flags)
  swcMinify: false,
  experimental: {
    esmExternals: 'loose',
  },
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: `${process.env.NEXT_PUBLIC_AUTH_API_URL}:path*`, //https://staging.auth.yieldz.net/api/web/sessions/logout'
      },
      {
        source: '/api/core/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}:path*` //  https://dev-core.yieldz.net/api/v1/users/wallet-address
      }
    ];
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.fallback = {
      ...webpackConfig.resolve.fallback,
      '@react-native-async-storage/async-storage': false,
      punycode: require.resolve('punycode/'),
    };

    return webpackConfig;
  },
};

// ✅ Runtime patch (for Node.js / Next.js server)
try {
  // Replace the deprecated core module with the maintained one
  require('module').builtinModules = require('module').builtinModules.filter(
    (m) => m !== 'punycode'
  );
  require.cache[require.resolve('punycode')] = require('punycode/');
} catch {
  // ignore if not available
}

export default config;
