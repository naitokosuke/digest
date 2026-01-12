import { sources } from '../data/sources'
import { fetchAllFeeds } from '../utils/feed'

export default defineEventHandler(async () => {
  const feeds = await fetchAllFeeds(sources)

  return feeds.map(item => ({
    ...item,
    publishedAt: item.publishedAt.toISOString()
  }))
})
