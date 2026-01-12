import type { Source } from '~~/shared'

export const sources: Source[] = [
  {
    type: 'rss',
    name: 'Zenn',
    url: 'https://zenn.dev/naitokosuke/feed',
    icon: 'simple-icons:zenn'
  }
  // Blog (blog.naito.dev) - RSS will be added later
  // Slides (slides.naito.dev) - manual URLs, no RSS
]
