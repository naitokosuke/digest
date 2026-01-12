<script setup lang="ts">
interface Props {
  title: string
  description?: string
  url: string
  image?: string
  publishedAt: string
  source: {
    name: string
    icon: string
  }
}

defineProps<Props>()

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <a :href="url" target="_blank" rel="noopener noreferrer" class="feed-card">
    <div v-if="image" class="feed-card__image">
      <NuxtImg :src="image" :alt="title" loading="lazy" />
    </div>
    <div class="feed-card__content">
      <h2 class="feed-card__title">{{ title }}</h2>
      <p v-if="description" class="feed-card__description">{{ description }}</p>
      <div class="feed-card__meta">
        <span class="feed-card__source">
          <Icon :name="source.icon" size="16" />
          {{ source.name }}
        </span>
        <time :datetime="publishedAt" class="feed-card__date">
          {{ formatDate(publishedAt) }}
        </time>
      </div>
    </div>
  </a>
</template>

<style scoped>
.feed-card {
  display: block;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.2s ease;
}

.feed-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.feed-card__image {
  aspect-ratio: 1200 / 630;
  overflow: hidden;
}

.feed-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.feed-card__content {
  padding: 16px;
}

.feed-card__title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 8px;
  line-height: 1.4;
}

.feed-card__description {
  font-size: 0.875rem;
  color: #666;
  margin: 0 0 12px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.feed-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #888;
}

.feed-card__source {
  display: flex;
  align-items: center;
  gap: 4px;
}

.feed-card__date {
  color: #999;
}
</style>
