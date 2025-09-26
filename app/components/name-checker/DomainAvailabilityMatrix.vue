<template>
  <UCard class="h-fit" :ui="{ body: '!p-6' }">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-globe-alt" class="text-lg" />
        <h3 class="text-lg font-semibold">Domain Availability</h3>
      </div>
    </template>

    <div v-if="hasResults">
      <AdaptiveTable
        :row-headers="nameVariations"
        :column-headers="tldHeaders"
        row-header-label="Name"
        column-header-label="TLD"
        :auto-transpose="true"
        transpose-breakpoint="md"
      >
        <template #cell="{ rowHeader: variation, colHeader: tld }">
          <UTooltip :text="getDomainTooltipText(variation, tld)">
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
      </AdaptiveTable>
    </div>
    
    <div v-else-if="hasError && !isLoading" class="text-center py-8">
      <UIcon name="i-heroicons-exclamation-triangle" class="text-yellow-500 text-2xl mb-2" />
      <p class="text-sm text-neutral-600 dark:text-neutral-400">Failed to check domain availability</p>
      <UButton @click="$emit('retry')" variant="ghost" size="xs" class="mt-2">
        Retry
      </UButton>
    </div>
    
    <div v-else-if="isLoading">
      <AdaptiveTable
        :row-headers="nameVariations"
        :column-headers="tldHeaders"
        row-header-label="Name"
        column-header-label="TLD"
        :auto-transpose="true"
        transpose-breakpoint="md"
      >
        <template #cell="{ rowHeader: variation, colHeader: tld }">
          <!-- Show progressive results if available -->
          <template v-if="getDomainResult(variation, tld)">
            <UTooltip :text="getDomainTooltipText(variation, tld)">
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
        </template>
      </AdaptiveTable>
    </div>
    
    <div v-else>
      <AdaptiveTable
        :row-headers="nameVariations"
        :column-headers="tldHeaders"
        row-header-label="Name"
        column-header-label="TLD"
        :auto-transpose="true"
        transpose-breakpoint="md"
      >
        <template #cell>
          <div class="p-1">
            <UIcon
              name="i-heroicons-question-mark-circle"
              class="text-lg text-neutral-300 dark:text-neutral-600"
            />
          </div>
        </template>
      </AdaptiveTable>
      <div class="text-center mt-4 text-neutral-500 dark:text-neutral-400">
        <p class="text-sm">Enter a name above to check domain availability</p>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import AdaptiveTable from '~/components/common/AdaptiveTable.vue'

interface DomainResult {
  url: string
  variation: string
  tld: string
  available: boolean
  priceInCents: number
  status: 'success' | 'error'
  expires?: string
  error?: string
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

// Headers for AdaptiveTable
const tldHeaders = computed(() => tlds.map(tld => `.${tld}`))

const nameVariations = computed(() => {
  // Always show dash placeholders for name variations
  return ['-', 'get-', 'try-', '-app', '-ly']
})

const getDomainUrl = (variation: string, tldHeader: string) => {
  const tld = tldHeader.replace('.', '') // Remove the dot prefix
  if (!props.searchName) return `https://${variation}.${tld}`

  // Replace dash with actual search name
  const actualVariation = variation.replace('-', props.searchName)
  return `https://${actualVariation}.${tld}`
}

// Domain-specific helper functions
const getDomainResult = (variation: string, tldHeader: string) => {
  const tld = tldHeader.replace('.', '') // Remove the dot prefix
  const key = `${variation}-${tld}`
  return props.domainResults.get(key)
}

const getDomainStatusIcon = (variation: string, tldHeader: string) => {
  const result = getDomainResult(variation, tldHeader)
  if (!result) return 'i-heroicons-question-mark-circle'

  if (result.status === 'error') return 'i-heroicons-exclamation-triangle'
  return result.available ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'
}

const getDomainStatusColor = (variation: string, tldHeader: string) => {
  const result = getDomainResult(variation, tldHeader)
  if (!result) return 'text-neutral-400 dark:text-neutral-500'

  if (result.status === 'error') return 'text-yellow-500 dark:text-yellow-400'
  return result.available ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'
}

const getDomainTooltipText = (variation: string, tldHeader: string) => {
  const result = getDomainResult(variation, tldHeader)
  if (!result) return getDomainUrl(variation, tldHeader)

  if (result.status === 'error') {
    return result.error || 'Error checking domain'
  }

  if (!result.available && result.expires) {
    const expiryDate = new Date(result.expires)
    const localExpiry = expiryDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    return `Expires: ${localExpiry}`
  }

  return result.available ? 'Available' : 'Not available'
}
</script>