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
  },
  {
    type: 'rss',
    name: 'Slides',
    url: 'https://slides.naito.dev/feed.xml',
    icon: 'mdi:presentation'
  }
  // Blog (blog.naito.dev) - RSS feed not available yet
]
