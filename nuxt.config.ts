// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    head: {
      title: 'Digest',
      meta: [
        { name: 'description', content: "naitokosuke's feed digest" },
        { property: 'og:title', content: 'Digest' },
        { property: 'og:description', content: "naitokosuke's feed digest" },
        { property: 'og:image', content: 'https://digest.naito.dev/og-image.png' },
        { property: 'og:url', content: 'https://digest.naito.dev/' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ]
    }
  },

  modules: [
    '@vizejs/nuxt',
    '@nuxt/a11y',
    '@nuxt/fonts',
    '@nuxt/hints',
    '@nuxt/icon',
    '@nuxt/image'
  ],

  image: {
    provider: 'none'
  },

  // Fetch and render feeds at build time so the Worker serves static assets
  // and never parses feeds per request (Workers free plan: 10ms CPU per request).
  // Lint / fmt / check run through Vite+ (vite.config.ts); the module only wires .vue
  // files into the generated tsconfig for `vize check`. Its SFC compiler is off: with
  // it on, prerendering `/` fails because <NuxtImg> resolves to Nuxt's stub instead of
  // the @nuxt/image component (@vizejs/nuxt 0.627.0).
  vize: { compiler: false, lint: false },

  routeRules: {
    '/': { prerender: true },
    '/api/feeds': { prerender: true }
  },

  nitro: {
    preset: 'cloudflare_module',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
      // Must match the existing Worker (Cloudflare Git integration deploys it as `digest`)
      wrangler: { name: 'digest' }
    }
  }
})
