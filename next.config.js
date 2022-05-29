const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
  PHASE_PRODUCTION_SERVER
} = require('next/constants');

module.exports = (phase) => {
  // npm run dev or next dev
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  // npm run build or next build
  const isProd = phase === PHASE_PRODUCTION_BUILD && process.env.STAGING !== '1';
  // npm run build or next build
  const isStaging = phase === PHASE_PRODUCTION_BUILD && process.env.STAGING === '1';

  return {
    webpack: (config, { isServer }) => { // Fix error on getInitialProps or getServerSideProps
      // Fixes npm packages that depend on `fs` module
      if (!isServer) {
        config.node = {
          fs: 'empty'
        };
      }
      return config;
    },
    env: {
      server: isProd ? 'https://everboards-next.vercel.app' : 'http://localhost:3000'
    },
    redirects: async () => {
      return [{
        source: '/',
        destination: '/assets',
        permanent: false
      }];
    }
  };
}