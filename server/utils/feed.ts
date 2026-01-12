import type { Source, FeedItem } from '~~/shared'

function getTagContent(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))
  return match?.[1]?.trim() || ''
}

function getEnclosureUrl(xml: string): string | undefined {
  const match = xml.match(/<enclosure[^>]+url=["']([^"']+)["']/)
  return match?.[1]
}

function parseRssXml(xml: string, source: Source): FeedItem[] {
  const items: FeedItem[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1]

    items.push({
      title: getTagContent(itemXml, 'title'),
      description: getTagContent(itemXml, 'description') || undefined,
      url: getTagContent(itemXml, 'link'),
      image: getEnclosureUrl(itemXml),
      publishedAt: new Date(getTagContent(itemXml, 'pubDate') || Date.now()),
      source: {
        name: source.name,
        icon: source.icon
      }
    })
  }

  return items
}

export async function fetchRssFeed(source: Source): Promise<FeedItem[]> {
  const response = await fetch(source.url)
  const xml = await response.text()
  return parseRssXml(xml, source)
}

export async function fetchAllFeeds(sources: Source[]): Promise<FeedItem[]> {
  const results = await Promise.all(sources.map(fetchRssFeed))

  return results
    .flat()
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
}
