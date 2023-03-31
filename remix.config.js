/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ['**/.*'],
  server: process.env.NETLIFY || process.env.NETLIFY_LOCAL ? './server.js' : undefined,
  serverBuildPath: '.netlify/functions-internal/server.js',
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  future: {
    v2_routeConvention: true,
    v2_meta: true,
    v2_errorBoundary: true,
    unstable_tailwind: true,
    v2_normalizeFormMethod: true
  }
};
