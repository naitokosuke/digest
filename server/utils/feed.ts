import Parser from 'rss-parser'
import { unfurl } from 'unfurl.js'
import type { Source, FeedItem } from '~~/shared'

const parser = new Parser()

export async function fetchRssFeed(source: Extract<Source, { type: 'rss' }>): Promise<FeedItem[]> {
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

export async function fetchOgpMetadata(url: string, source: Extract<Source, { type: 'manual' }>): Promise<FeedItem | null> {
  try {
    const result = await unfurl(url)
    const og = result.open_graph

    return {
      title: og?.title || result.title || '',
      description: og?.description || result.description || undefined,
      url: og?.url || url,
      image: og?.images?.[0]?.url || undefined,
      publishedAt: new Date(),
      source: {
        name: source.name,
        icon: source.icon
      }
    }
  }
  catch {
    return null
  }
}

export async function fetchManualSource(source: Extract<Source, { type: 'manual' }>): Promise<FeedItem[]> {
  const results = await Promise.all(
    source.urls.map(url => fetchOgpMetadata(url, source))
  )
  return results.filter((item): item is FeedItem => item !== null)
}

export async function fetchAllFeeds(sources: Source[]): Promise<FeedItem[]> {
  const results = await Promise.all(
    sources.map(source => {
      if (source.type === 'rss') {
        return fetchRssFeed(source)
      }
      return fetchManualSource(source)
    })
  )

  return results
    .flat()
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
}
