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
    '@nuxt/a11y',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/hints',
    '@nuxt/icon',
    '@nuxt/image'
  ],

  image: {
    provider: 'none'
  },

  nitro: {
    preset: 'cloudflare_module',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    }
  }
})
