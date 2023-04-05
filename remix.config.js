// eslint-disable-next-line @typescript-eslint/no-var-requires
const { flatRoutes } = require('remix-flat-routes');

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ['**/*'],
  server: process.env.NETLIFY || process.env.NETLIFY_LOCAL ? './server.js' : undefined,
  serverBuildPath: '.netlify/functions-internal/server.js',
  future: {
    v2_routeConvention: true,
    v2_meta: true,
    v2_errorBoundary: true,
    unstable_tailwind: true,
    v2_normalizeFormMethod: true
  },
  routes: async (defineRoutes) => {
    return flatRoutes('routes', defineRoutes);
  }
};
