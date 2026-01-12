import Parser from 'rss-parser'
import type { Source, FeedItem } from '~~/shared'

const parser = new Parser()

export async function fetchRssFeed(source: Source): Promise<FeedItem[]> {
  const feed = await parser.parseURL(source.url)

  return feed.items.map(item => ({
    title: item.title || '',
    description: item.contentSnippet || item.content || undefined,
    url: item.link || '',
    image: item.enclosure?.url || undefined,
    publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
    source: {
      name: source.name,
      icon: source.icon
    }
  }))
}

export async function fetchAllFeeds(sources: Source[]): Promise<FeedItem[]> {
  const results = await Promise.all(sources.map(fetchRssFeed))

  return results
    .flat()
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
}
