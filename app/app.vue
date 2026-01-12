<script setup lang="ts">
useSeoMeta({
  title: 'Digest',
  ogTitle: 'Digest',
  description: 'naitokosuke\'s feed digest',
  ogDescription: 'naitokosuke\'s feed digest',
  ogImage: '/og-image.png',
  twitterCard: 'summary_large_image'
})

const { data: feeds, status } = await useFetch('/api/feeds')
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <header>
      <h1>Digest</h1>
    </header>
    <main>
      <p v-if="status === 'pending'">Loading...</p>
      <p v-else-if="status === 'error'">Failed to load feeds</p>
      <section v-else>
        <FeedCard
          v-for="feed in feeds"
          :key="feed.url"
          :title="feed.title"
          :description="feed.description"
          :url="feed.url"
          :image="feed.image"
          :published-at="feed.publishedAt"
          :source="feed.source"
        />
      </section>
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #f5f5f5;
  color: #333;
  line-height: 1.6;
}
</style>

<style scoped>
div {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;

  header {
    margin-bottom: 32px;

    h1 {
      font-size: 2rem;
      font-weight: 700;
    }
  }

  main {
    p {
      text-align: center;
      padding: 48px;
      color: #666;
    }

    section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 480px), 1fr));
      gap: 24px;
    }
  }
}
</style>
