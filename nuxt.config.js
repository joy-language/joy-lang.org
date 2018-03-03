module.exports = {
  head: {
    title: 'Joy language',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Joy Programming Language' }
    ],
    link: [
      { 
        rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Fira+Sans:200,500|Roboto:400|Roboto+Mono:400' 
      },
      { 
        rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'
      },
      { 
        rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico?' 
      }
    ]
  },
  loading: false,
  // Scroll to the top when rendering all routes
  router: {
    scrollBehavior: function (to, from, savedPosition) {
      return { x: 0, y: 0 }
    }
  },
  build: {
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
