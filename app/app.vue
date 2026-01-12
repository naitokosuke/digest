<script setup lang="ts">
const { data: feeds, status } = await useFetch('/api/feeds')
</script>

<template>
  <div class="container">
    <NuxtRouteAnnouncer />
    <header class="header">
      <h1>Digest</h1>
    </header>
    <main class="main">
      <div v-if="status === 'pending'" class="loading">
        Loading...
      </div>
      <div v-else-if="status === 'error'" class="error">
        Failed to load feeds
      </div>
      <div v-else class="feed-grid">
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
      </div>
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
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.header {
  margin-bottom: 32px;
}

.header h1 {
  font-size: 2rem;
  font-weight: 700;
}

.loading,
.error {
  text-align: center;
  padding: 48px;
  color: #666;
}

.feed-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 480px), 1fr));
  gap: 24px;
}
</style>
