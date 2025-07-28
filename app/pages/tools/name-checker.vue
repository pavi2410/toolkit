<script setup lang="ts">
import { useDebounceFn, useUrlSearchParams } from '@vueuse/core'
import PlatformAvailabilityCard from '~/components/name-checker/PlatformAvailabilityCard.vue'
import DomainAvailabilityMatrix from '~/components/name-checker/DomainAvailabilityMatrix.vue'

definePageMeta({
  layout: false,
})

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
  if (!searchParams.name.trim()) {
    error.value = 'Please enter a name'
    return
  }

  error.value = ''
  paQuery.refresh()
  daQuery.refresh()
}

const debouncedSearch = useDebounceFn(() => {
  if (searchParams.name.trim()) {
    doSearch()
  }
}, 500)

watch(() => searchParams.name, debouncedSearch)

</script>

<template>
  <NuxtLayout name="tool-layout" emoji="™️" toolName="Name Checker">
    <div class="h-[calc(100vh-theme(spacing.12))] p-6 grid grid-rows-[auto_1fr] gap-6">
      <!-- Header Section -->
      <div class="text-center">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">Name Checker</h1>
        <p class="text-slate-600 dark:text-slate-400 mb-6">Find out if your project name is taken across platforms and domains</p>
        
        <div class="max-w-md mx-auto">
          <UInput 
            v-model.trim="searchParams.name" 
            @keyup.enter="doSearch" 
            placeholder="Enter project name..." 
            size="lg"
            :loading="isLoading"
            class="w-full"
          />
          
          <UAlert 
            v-if="error" 
            icon="i-heroicons-exclamation-circle" 
            color="red" 
            variant="subtle" 
            :description="error" 
            class="mt-3"
          />
        </div>
      </div>

      <!-- Results Section -->
      <div v-if="searchParams.name.trim()" class="space-y-6">
        
        <DomainAvailabilityMatrix
          :status="daQuery.status.value"
          :data="daQuery.data.value"
          :search-name="searchParams.name"
          @retry="daQuery.refresh()"
        />

        <PlatformAvailabilityCard
          :status="paQuery.status.value"
          :data="paQuery.data.value"
          @retry="paQuery.refresh()"
        />
      </div>
      
      <!-- Empty State -->
      <div v-else class="flex items-center justify-center h-full">
        <div class="text-center">
          <UIcon name="i-heroicons-magnifying-glass" class="text-4xl text-gray-400 mb-4" />
          <p class="text-gray-500 dark:text-gray-400">Enter a name above to check availability</p>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
