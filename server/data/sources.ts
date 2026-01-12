import type { Source } from '~~/shared'

export const sources: Source[] = [
  {
    type: 'rss',
    name: 'Zenn',
    url: 'https://zenn.dev/kosuke_naito/feed',
    icon: 'simple-icons:zenn'
  },
  {
    type: 'rss',
    name: 'しずかなインターネット',
    url: 'https://sizu.me/engineer_naito/rss',
    icon: 'mdi:pencil'
  }
  // Blog (blog.naito.dev) - RSS will be added later
  // Slides (slides.naito.dev) - manual URLs, no RSS
]
