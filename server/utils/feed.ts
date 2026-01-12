import type { Source, FeedItem } from '~~/shared'

function getTextContent(element: Element | null): string {
  return element?.textContent?.trim() || ''
}

function parseRssXml(xml: string, source: Source): FeedItem[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, 'text/xml')
  const items = doc.querySelectorAll('item')

  return Array.from(items).map((item) => {
    const enclosure = item.querySelector('enclosure')

    return {
      title: getTextContent(item.querySelector('title')),
      description: getTextContent(item.querySelector('description')) || undefined,
      url: getTextContent(item.querySelector('link')),
      image: enclosure?.getAttribute('url') || undefined,
      publishedAt: new Date(getTextContent(item.querySelector('pubDate')) || Date.now()),
      source: {
        name: source.name,
        icon: source.icon
      }
    }
  })
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
