export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const url = query.url as string

  if (!url) {
    throw createError({ statusCode: 400, message: 'Missing url parameter' })
  }

  const allowedHosts = [
    'blog.naito.dev',
    'slides.naito.dev',
    'zenn.dev',
    'res.cloudinary.com',
    'static.sizu.me',
    'r2.sizu.me'
  ]

  const parsedUrl = new URL(url)
  if (!allowedHosts.includes(parsedUrl.host)) {
    throw createError({ statusCode: 403, message: 'Host not allowed' })
  }

  const response = await fetch(url)
  const contentType = response.headers.get('content-type') || 'image/png'
  const buffer = await response.arrayBuffer()

  setHeader(event, 'Content-Type', contentType)
  setHeader(event, 'Cache-Control', 'public, max-age=86400')

  return new Uint8Array(buffer)
})
