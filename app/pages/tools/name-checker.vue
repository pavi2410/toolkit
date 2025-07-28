<script setup lang="ts">
import { useDebounceFn, useUrlSearchParams } from '@vueuse/core'
import PlatformAvailabilityCard from '~/components/name-checker/PlatformAvailabilityCard.vue'
import DomainAvailabilityMatrix from '~/components/name-checker/DomainAvailabilityMatrix.vue'

definePageMeta({
  layout: false,
})

// Types for new API structure
interface PlatformResult {
  platform: string
  available: boolean
  link: string
  status: 'success' | 'error'
}

interface DomainResult {
  url: string
  variation: string
  tld: string
  available: boolean
  priceInCents: number
  status: 'success' | 'error'
}

const searchParams = useUrlSearchParams('history', {
  initialValue: {
    name: '',
  }
})

// Platform and domain configuration
const platforms = [
  'GitHub repo', 'GitHub org/user', 'PyPI package', 'Homebrew cask/formula', 'Rust crate',
  'npm package', 'npm org', 'Ruby gem', 'Nuget package', 'Packagist package', 'Go package'
]

const tlds = ['com', 'net', 'org', 'io', 'dev', 'app', 'in', 'tech', 'co', 'ai', 'xyz', 'me', 'ing']
const variations = ['-', 'get-', 'try-', '-app', '-ly']

// Reactive state
const platformResults = ref<Map<string, PlatformResult>>(new Map())
const domainResults = ref<Map<string, DomainResult>>(new Map())
const isLoading = ref(false)
const error = ref('')
const currentAbortController = ref<AbortController | null>(null)

async function checkPlatforms(name: string, signal: AbortSignal) {
  const promises = platforms.map(async (platform) => {
    try {
      const result = await $fetch('/api/check-platform', {
        query: { name, platform },
        signal
      }) as PlatformResult
      
      // Only update if not aborted
      if (!signal.aborted) {
        platformResults.value.set(platform, result)
      }
    } catch (err: any) {
      // Don't show errors for aborted requests
      if (err.name === 'AbortError' || signal.aborted) {
        return
      }
      
      platformResults.value.set(platform, {
        platform,
        available: false,
        link: '#',
        status: 'error'
      })
    }
  })

  return Promise.allSettled(promises)
}

async function checkDomains(name: string, signal: AbortSignal) {
  const promises = []
  
  for (const tld of tlds) {
    for (const variation of variations) {
      promises.push(async () => {
        const key = `${variation}-${tld}`
        try {
          const result = await $fetch('/api/check-domain', {
            query: { name, variation, tld },
            signal
          }) as DomainResult
          
          // Only update if not aborted
          if (!signal.aborted) {
            domainResults.value.set(key, result)
          }
        } catch (err: any) {
          // Don't show errors for aborted requests
          if (err.name === 'AbortError' || signal.aborted) {
            return
          }
          
          domainResults.value.set(key, {
            url: `https://${variation.replace('-', name)}.${tld}`,
            variation,
            tld,
            available: false,
            priceInCents: 0,
            status: 'error'
          })
        }
      })
    }
  }

  return Promise.allSettled(promises.map(fn => fn()))
}

async function doSearch() {
  if (!searchParams.name.trim()) {
    error.value = 'Please enter a name'
    return
  }

  // Cancel any ongoing requests
  if (currentAbortController.value) {
    currentAbortController.value.abort()
  }

  // Create new abort controller for this search
  currentAbortController.value = new AbortController()
  const signal = currentAbortController.value.signal

  error.value = ''
  isLoading.value = true
  
  // Clear previous results
  platformResults.value.clear()
  domainResults.value.clear()

  try {
    await Promise.all([
      checkPlatforms(searchParams.name, signal),
      checkDomains(searchParams.name, signal)
    ])
  } catch (err: any) {
    // Don't show errors for aborted requests
    if (err.name !== 'AbortError' && !signal.aborted) {
      error.value = 'Search failed. Please try again.'
    }
  } finally {
    // Only update loading state if this request wasn't aborted
    if (!signal.aborted) {
      isLoading.value = false
    }
  }
}

const debouncedSearch = useDebounceFn(() => {
  if (searchParams.name.trim()) {
    doSearch()
  }
}, 500)

watch(() => searchParams.name, debouncedSearch)

// Cleanup on unmount
onUnmounted(() => {
  if (currentAbortController.value) {
    currentAbortController.value.abort()
  }
})

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
          :domain-results="domainResults"
          :is-loading="isLoading"
          :search-name="searchParams.name"
          @retry="doSearch"
        />

        <PlatformAvailabilityCard
          :platform-results="platformResults"
          :is-loading="isLoading"
          @retry="doSearch"
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
