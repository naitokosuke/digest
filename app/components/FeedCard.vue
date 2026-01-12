<script lang="ts">
function formatDate(d: string | Date): string {
  const date = d instanceof Date ? d : new Date(d)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

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

const props = defineProps<Props>()

const proxyImageUrl = computed(() => {
  if (!props.image) return undefined
  return `/api/image?url=${encodeURIComponent(props.image)}`
})
</script>

<template>
  <NuxtLink :to="url" external target="_blank">
    <figure v-if="proxyImageUrl">
      <NuxtImg :src="proxyImageUrl" :alt="title" loading="lazy" />
    </figure>
    <div>
      <h2>{{ title }}</h2>
      <p v-if="description">{{ description }}</p>
      <footer>
        <span>
          <Icon :name="source.icon" size="16" />
          {{ source.name }}
        </span>
        <time :datetime="publishedAt">
          {{ formatDate(publishedAt) }}
        </time>
      </footer>
    </div>
  </NuxtLink>
</template>

<style scoped>
a {
  display: block;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  figure {
    aspect-ratio: 1200 / 630;
    overflow: hidden;
    margin: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  > div {
    padding: 16px;

    h2 {
      font-size: 1rem;
      font-weight: 600;
      margin: 0 0 8px;
      line-height: 1.4;
    }

    p {
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

    footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.75rem;
      color: #888;

      span {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      time {
        color: #999;
      }
    }
  }
}
</style>
