export default {
  dev: process.env.NODE_ENV !== 'production',
  prod: process.env.NODE_ENV === 'production',

  ssr: false,
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'static',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: 'Unbound App Interface',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'title',
        name: 'title',
        content: 'Unbound Finance',
      },
      {
        hid: 'description',
        name: 'description',
        content: 'The DeFi Treasury For Liquidity Pool Tokens',
      },
      {
        hid: 'apple-mobile-web-app-title',
        name: 'apple-mobile-web-app-title',
        content: 'Unbound Finance',
      },
      {
        hid: 'og:title',
        name: 'og:title',
        property: 'og:title',
        content: 'Unbound Finance',
      },
      {
        hid: 'og:site_name',
        name: 'og:site_name',
        property: 'og:site_name',
        content: 'Unbound Finance',
      },
      {
        hid: 'og:description',
        name: 'og:description',
        property: 'og:description',
        content: 'The DeFi Treasury For Liquidity Pool Tokens',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        src: 'https://kit.fontawesome.com/8c55e9bfce.js',
      },
    ],
  },
  /*
   ** Global CSS
   */
  css: ['@/assets/css/loading-dots.css'],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    '@/plugins/ga.js',
    '@/plugins/vue-tailwind.js',
    '@/plugins/vue-tooltip.js',
    '@/plugins/numberFormatter.js',
    '@/plugins/vue-content-loader.js',
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    'nuxt-purgecss',
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/dayjs',
    '@nuxtjs/dotenv',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {},
  purgeCSS: {
    whitelist: [
      'dark-mode',
      'light-mode',
      'tooltip',
      'tooltip-inner',
      'tooltip-arrow',
      'tooltip.popover',
      'popover-arrow',
    ],
  },
}
