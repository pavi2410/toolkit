<script setup lang="ts">
definePageMeta({
  layout: false,
})

useHead({
  title: 'Name Checker',
  link: [
    {
      rel: 'icon',
      href: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">™️</text></svg>`
    }
  ]
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
  <NuxtLayout name="tool-layout">
    <template #header>
      ™️ Name Checker
    </template>

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

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <h2 class="text-xl font-bold mb-2" v-if="paQuery.status.value !== 'idle'">
              Platform Availability
            </h2>
            <div v-for="(platform, index) in paQuery.data.value" :key="index" class="flex items-center"
              v-if="paQuery.status.value === 'success'">
              <span :class="platform.available ? 'text-green-500' : 'text-red-500'" class="mr-2">
                {{ platform.available ? '✓' : '✗' }}
              </span>
              <span>
                <a :href="platform.link" target="_blank" class="text-blue-400 hover:underline">
                  {{ platform.platform }}
                </a>
              </span>
              <span class="ml-1 text-gray-400">
                <template v-if="platform.available">
                  already exists
                </template>
                <template v-else>
                  is available!
                </template>
              </span>
            </div>
            <template v-else-if="paQuery.status.value === 'pending'">
              <div class="flex flex-col gap-4">
                <div class="flex items-center gap-2" v-for="i in 10" :key="i">
                  <USkeleton class="size-5" :ui="{ rounded: 'rounded-full' }" />
                  <USkeleton class="h-4 w-48" />
                </div>
              </div>
            </template>
          </div>

          <div class="flex flex-col gap-2">
            <h2 class="text-xl font-bold mb-2" v-if="daQuery.status.value !== 'idle'">
              Domain Availability
            </h2>
            <div v-for="(domain, index) in daQuery.data.value" :key="index" class="flex items-center"
              v-if="daQuery.status.value === 'success'">
              <span :class="domain.available ? 'text-green-500' : 'text-red-500'" class="mr-2">
                {{ domain.available ? '✓' : '✗' }}
              </span>
              <span>
                <a :href="domain.url" target="_blank" class="text-blue-400 hover:underline">
                  {{ formatUrl(domain.url) }}
                </a>
              </span>
              <span class="ml-1 text-gray-400">
                <template v-if="domain.available">
                  already exists
                </template>
                <template v-else>
                  is available for ${{ (domain.priceInCents / 100).toFixed(2) }}!
                </template>
              </span>
            </div>
            <template v-else-if="daQuery.status.value === 'pending'">
              <div class="flex flex-col gap-4">
                <div class="flex items-center gap-2" v-for="i in 10" :key="i">
                  <USkeleton class="size-5" :ui="{ rounded: 'rounded-full' }" />
                  <USkeleton class="h-4 w-48" />
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
