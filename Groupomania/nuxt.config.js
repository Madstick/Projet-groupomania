export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Groupomania',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: "Site interne de l'entreprise Groupomania",
      },
    ],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['@mdi/font/css/materialdesignicons.min.css'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: ['~plugins/filters.js'],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: false,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    // '@nuxtjs/eslint-module',
    ['@nuxtjs/vuetify', { iconfont: 'mdi' }],
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/pwa',
    '@nuxtjs/toast',
  ],
  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000/api',
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},

  server: {
    port: 8000,
  },

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: 'http://localhost:3000/api/auth/login',
            method: 'post',
            propertyName: 'token',
          },
          logout: {
            url: 'http://localhost:3000/api/auth/logout',
            method: 'get',
            propertyName: 'token',
          },
          user: {
            url: 'http://localhost:3000/api/auth/current',
            method: 'get',
            propertyName: 'user',
          },
        },
        tokenRequired: true,
        tokenType: 'Bearer',
      },
    },
    redirect: {
      login: '/user/login', // User will be redirected to this path if login is required
      logout: '/', // User will be redirected to this path if after logout, current route is protected
      home: '/messages', // User will be redirect to this path after login if accessed login page directly
    },
    rewriteRedirects: true,
  },

  toast: {
    position: 'bottom-center',
  },

  pwa: {
    manifest: {
      lang: 'fr',
    },
    icon: false,
  },
}
