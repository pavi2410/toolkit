<script setup lang="ts">
definePageMeta({
  layout: false,
})

import { useUrlSearchParams } from '@vueuse/core';
import { ref } from 'vue';

const formatUrl = (url: string) => {
  return new URL(url).hostname
}

const searchParams = useUrlSearchParams('history', {
  initialValue: {
    name: '',
  }
})

const paQuery = useAsyncData(
  `platformsAvailability:${searchParams.name}`,
  () => $fetch('/api/fetchPlatformAvailability', { query: { name: searchParams.name } }),
  {
    immediate: searchParams.name !== '',
  }
)

const daQuery = useAsyncData(
  `domainsAvailability:${searchParams.name}`,
  () => $fetch('/api/fetchDomainAvailability', { query: { name: searchParams.name } }),
  {
    immediate: searchParams.name !== '',
  }
)

const isLoading = computed(() => paQuery.status.value === 'pending' || daQuery.status.value === 'pending')
const error = ref('')

function doSearch() {
  if (!searchParams.name) {
    error.value = 'Please enter a name'
    return
  }

  error.value = ''

  paQuery.refresh()
  daQuery.refresh()
}
</script>

<template>
  <NuxtLayout name="tool-layout" emoji="™️" toolName="Name Checker">
    <div class="flex flex-col items-center justify-center p-4">
      <h1 class="text-3xl font-bold mb-2">Name Checker</h1>
      <p class="mb-6">Find out if your project name is taken</p>

      <div class="flex flex-col gap-4">
        <UButtonGroup size="lg" class="w-full">
          <UInput v-model.trim="searchParams.name" @keyup.enter="doSearch" placeholder="Type some name..."
            class="w-full" />
          <UButton icon="i-heroicons-magnifying-glass" color="gray" :loading="isLoading" @click="doSearch" />
        </UButtonGroup>

        <UAlert v-if="error" icon="i-heroicons-exclaimation-circle" color="red" variant="subtle" title="Heads up!"
          :description="error" />

        <div class="flex flex-col sm:flex-row gap-4 overflow-auto">
          <UCard v-if="paQuery.status.value !== 'idle'"
            :ui="{ header: { padding: '!py-2 !px-4' }, body: { padding: '!p-4' } }">
            <template #header>
              Platform Availability
            </template>
            <div v-if="paQuery.status.value === 'success'" class="flex flex-col gap-2">
              <div v-for="(platform, index) in paQuery.data.value" :key="index" class="flex items-center gap-2">
                <span :class="platform.available ? 'text-green-500' : 'text-red-500'">
                  {{ platform.available ? '✓' : '✗' }}
                </span>
                <a :href="platform.link" target="_blank" class="text-blue-400 hover:underline">
                  {{ platform.platform }}
                </a>
              </div>
            </div>
            <template v-else-if="paQuery.status.value === 'pending'">
              <div class="flex flex-col gap-4">
                <div class="flex items-center gap-2" v-for="i in 10" :key="i">
                  <USkeleton class="size-5" :ui="{ rounded: 'rounded-full' }" />
                  <USkeleton class="h-4 w-48" />
                </div>
              </div>
            </template>
          </UCard>

          <UCard v-if="daQuery.status.value !== 'idle'"
            :ui="{ header: { padding: '!py-2 !px-4' }, body: { padding: '!p-4' } }">
            <template #header>
              Domain Availability
            </template>
            <div v-if="daQuery.status.value === 'success'" class="grid lg:grid-cols-5 gap-2 w-max">
              <template v-for="(websiteVariations, index) in daQuery.data.value" :key="index">
                <div v-for="(website, windex) in websiteVariations" :key="windex" class="flex items-center gap-2">
                  <span :class="website.available ? 'text-green-500' : 'text-red-500'">
                    {{ website.available ? '✓' : '✗' }}
                  </span>
                  <a :href="website.url" target="_blank" class="text-blue-400 hover:underline">
                    {{ formatUrl(website.url) }}
                  </a>
                </div>
              </template>
            </div>
            <template v-else-if="daQuery.status.value === 'pending'">
              <div class="flex flex-col gap-4">
                <div class="flex items-center gap-2" v-for="i in 10" :key="i">
                  <USkeleton class="size-5" :ui="{ rounded: 'rounded-full' }" />
                  <USkeleton class="h-4 w-48" />
                </div>
              </div>
            </template>
          </UCard>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
