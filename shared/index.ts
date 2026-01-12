export type Source =
  | { type: 'rss'; url: string; name: string; icon: string }
  | { type: 'manual'; urls: string[]; name: string; icon: string }

export interface FeedItem {
  title: string
  description?: string
  url: string
  image?: string
  publishedAt: Date
  source: {
    name: string
    icon: string
  }
}
