<template>
  <UCard class="h-fit" :ui="{ body: { padding: '!p-6' } }">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-globe-alt" class="text-lg" />
        <h3 class="text-lg font-semibold">Domain Availability</h3>
      </div>
    </template>
    
    <div v-if="hasResults" class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <th class="text-left p-2 font-semibold text-gray-600 dark:text-gray-400">Name</th>
            <th v-for="tld in tlds" :key="tld" class="text-center p-1 font-semibold text-gray-600 dark:text-gray-400 min-w-[3rem]">
              .{{ tld }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="variation in nameVariations" :key="variation" 
              class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
            <td class="p-2 font-mono text-gray-700 dark:text-gray-300 font-medium">
              {{ variation }}
            </td>
            <td v-for="tld in tlds" :key="tld" class="text-center p-1">
              <UTooltip :text="getDomainUrl(variation, tld)">
                <UButton
                  :to="getDomainUrl(variation, tld)"
                  target="_blank"
                  variant="ghost"
                  size="xs"
                  class="p-1"
                >
                  <UIcon 
                    :name="getDomainStatusIcon(variation, tld)" 
                    :class="getDomainStatusColor(variation, tld)" 
                    class="text-lg"
                  />
                </UButton>
              </UTooltip>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-else-if="hasError && !isLoading" class="text-center py-8">
      <UIcon name="i-heroicons-exclamation-triangle" class="text-yellow-500 text-2xl mb-2" />
      <p class="text-sm text-gray-600 dark:text-gray-400">Failed to check domain availability</p>
      <UButton @click="$emit('retry')" variant="ghost" size="xs" class="mt-2">
        Retry
      </UButton>
    </div>
    
    <div v-else-if="isLoading" class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <th class="text-left p-2 font-semibold text-gray-600 dark:text-gray-400 min-w-[4rem]">
              <USkeleton class="h-4 w-16" />
            </th>
            <th v-for="tld in tlds" :key="tld" class="text-center p-1 font-semibold text-gray-600 dark:text-gray-400 min-w-[3rem]">
              <USkeleton class="h-4 w-8 mx-auto" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="variation in nameVariations" :key="variation" class="border-b border-gray-100 dark:border-gray-800">
            <td class="p-2">
              <USkeleton class="h-4 w-20" />
            </td>
            <td v-for="tld in tlds" :key="tld" class="text-center p-1">
              <!-- Show progressive results if available -->
              <template v-if="getDomainResult(variation, tld)">
                <UTooltip :text="getDomainUrl(variation, tld)">
                  <UButton
                    :to="getDomainUrl(variation, tld)"
                    target="_blank"
                    variant="ghost"
                    size="xs"
                    class="p-1"
                  >
                    <UIcon 
                      :name="getDomainStatusIcon(variation, tld)" 
                      :class="getDomainStatusColor(variation, tld)" 
                      class="text-lg"
                    />
                  </UButton>
                </UTooltip>
              </template>
              <template v-else>
                <USkeleton class="size-6 mx-auto" :ui="{ rounded: 'rounded-full' }" />
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <th class="text-left p-2 font-semibold text-gray-600 dark:text-gray-400">Name</th>
            <th v-for="tld in tlds" :key="tld" class="text-center p-1 font-semibold text-gray-600 dark:text-gray-400 min-w-[3rem]">
              .{{ tld }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="variation in nameVariations" :key="variation" 
              class="border-b border-gray-100 dark:border-gray-800">
            <td class="p-2 font-mono text-gray-500 dark:text-gray-400 font-medium">
              {{ variation }}
            </td>
            <td v-for="tld in tlds" :key="tld" class="text-center p-1">
              <div class="p-1">
                <UIcon 
                  name="i-heroicons-question-mark-circle" 
                  class="text-lg text-gray-300 dark:text-gray-600"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="text-center mt-4 text-gray-500 dark:text-gray-400">
        <p class="text-sm">Enter a name above to check domain availability</p>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface DomainResult {
  url: string
  variation: string
  tld: string
  available: boolean
  priceInCents: number
  status: 'success' | 'error'
}

const props = defineProps<{
  domainResults: Map<string, DomainResult>
  isLoading: boolean
  searchName: string
}>()

defineEmits<{
  retry: []
}>()

// Computed status for UI
const hasResults = computed(() => props.domainResults.size > 0)
const hasError = computed(() => 
  Array.from(props.domainResults.values()).some(result => result.status === 'error')
)

// Domain matrix helpers
const tlds = ['com', 'net', 'org', 'io', 'dev', 'app', 'in', 'tech', 'co', 'ai', 'xyz', 'me', 'ing']

const nameVariations = computed(() => {
  // Always show dash placeholders for name variations
  return ['-', 'get-', 'try-', '-app', '-ly']
})

const getDomainUrl = (variation: string, tld: string) => {
  if (!props.searchName) return `https://${variation}.${tld}`
  
  // Replace dash with actual search name
  const actualVariation = variation.replace('-', props.searchName)
  return `https://${actualVariation}.${tld}`
}

// Domain-specific helper functions
const getDomainResult = (variation: string, tld: string) => {
  const key = `${variation}-${tld}`
  return props.domainResults.get(key)
}

const getDomainStatusIcon = (variation: string, tld: string) => {
  const result = getDomainResult(variation, tld)
  if (!result) return 'i-heroicons-question-mark-circle'
  
  if (result.status === 'error') return 'i-heroicons-exclamation-triangle'
  return result.available ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'
}

const getDomainStatusColor = (variation: string, tld: string) => {
  const result = getDomainResult(variation, tld)
  if (!result) return 'text-gray-400 dark:text-gray-500'
  
  if (result.status === 'error') return 'text-yellow-500 dark:text-yellow-400'
  return result.available ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'
}
</script>