<template>
  <UCard class="h-fit" :ui="{ body: { padding: '!p-6' } }">
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-cube" class="text-lg" />
        <h3 class="text-lg font-semibold">Platform Availability</h3>
      </div>
    </template>
    
    <div v-if="status === 'success' && data" class="flex flex-wrap gap-3">
      <a
        v-for="(platform, index) in data" 
        :key="index"
        :href="platform.link"
        target="_blank"
        rel="noopener noreferrer"
        class="relative w-20 h-20 flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all duration-200 hover:scale-105 cursor-pointer"
        :class="{
          'border-green-300 bg-green-50 hover:bg-green-100 dark:border-green-600 dark:bg-green-950 dark:hover:bg-green-900': platform.available,
          'border-red-300 bg-red-50 hover:bg-red-100 dark:border-red-600 dark:bg-red-950 dark:hover:bg-red-900': !platform.available
        }"
      >
        <!-- Platform Icon -->
        <UIcon 
          :name="getPlatformIcon(platform.platform)" 
          class="text-2xl mb-1"
          :class="getPlatformIconColor(platform.platform)"
        />
        
        <!-- Platform Name -->
        <span class="text-xs text-center font-medium text-gray-700 dark:text-gray-300 leading-tight">
          {{ getPlatformDisplayName(platform.platform) }}
        </span>
        
        <!-- Status Badge -->
        <div class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center">
          <UIcon 
            :name="getStatusIcon(platform.available)" 
            :class="getStatusColor(platform.available)"
            class="text-md"
          />
        </div>
      </a>
    </div>
    
    <div v-else-if="status === 'error'" class="text-center py-8">
      <UIcon name="i-heroicons-exclamation-triangle" class="text-yellow-500 text-2xl mb-2" />
      <p class="text-sm text-gray-600 dark:text-gray-400">Failed to check platform availability</p>
      <UButton @click="$emit('retry')" variant="ghost" size="xs" class="mt-2">
        Retry
      </UButton>
    </div>
    
    <div v-else-if="status === 'pending'" class="flex flex-wrap gap-3">
      <div v-for="i in 8" :key="i" class="w-20 h-20 rounded-lg border-2 border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center p-2">
        <USkeleton class="size-8 mb-1" :ui="{ rounded: 'rounded-full' }" />
        <USkeleton class="h-3 w-12" />
      </div>
    </div>
    
    <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
      <p class="text-sm">Enter a name to check platform availability</p>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Platform {
  platform: string
  available: boolean
  link: string
}

defineProps<{
  status: 'idle' | 'pending' | 'success' | 'error'
  data?: Platform[]
}>()

defineEmits<{
  retry: []
}>()

const getStatusIcon = (available: boolean, hasError = false) => {
  if (hasError) return 'i-heroicons-exclamation-triangle'
  return available ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'
}

const getStatusColor = (available: boolean, hasError = false) => {
  if (hasError) return 'text-yellow-600 dark:text-yellow-500'
  return available ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
}

const getPlatformIcon = (platform: string) => {
  const iconMap: Record<string, string> = {
    'GitHub repo': 'i-devicon-github',
    'GitHub org/user': 'i-devicon-github',
    'PyPI package': 'i-devicon-python',
    'Homebrew cask/formula': 'i-simple-icons-homebrew',
    'Rust crate': 'i-devicon-rust',
    'npm package': 'i-devicon-npm',
    'npm org': 'i-devicon-npm',
    'Ruby gem': 'i-devicon-ruby',
    'Nuget package': 'i-devicon-nuget',
    'Packagist package': 'i-devicon-composer',
    'Go package': 'i-devicon-go'
  }
  return iconMap[platform] || 'i-heroicons-cube'
}

const getPlatformIconColor = (platform: string) => {
  const colorMap: Record<string, string> = {
    'GitHub repo': 'text-gray-800 dark:text-gray-200',
    'GitHub org/user': 'text-gray-800 dark:text-gray-200',
    'PyPI package': 'text-blue-600 dark:text-blue-400',
    'Homebrew cask/formula': 'text-yellow-600 dark:text-yellow-400',
    'Rust crate': 'text-orange-600 dark:text-orange-400',
    'npm package': 'text-red-600 dark:text-red-400',
    'npm org': 'text-red-600 dark:text-red-400',
    'Ruby gem': 'text-red-700 dark:text-red-400',
    'Nuget package': 'text-blue-700 dark:text-blue-400',
    'Packagist package': 'text-orange-700 dark:text-orange-400',
    'Go package': 'text-cyan-600 dark:text-cyan-400'
  }
  return colorMap[platform] || 'text-gray-600 dark:text-gray-400'
}

const getPlatformDisplayName = (platform: string) => {
  const nameMap: Record<string, string> = {
    'GitHub repo': 'GitHub',
    'GitHub org/user': 'GitHub User',
    'PyPI package': 'PyPI',
    'Homebrew cask/formula': 'Homebrew',
    'Rust crate': 'Crates.io',
    'npm package': 'npm',
    'npm org': 'npm Org',
    'Ruby gem': 'RubyGems',
    'Nuget package': 'NuGet',
    'Packagist package': 'Packagist',
    'Go package': 'Go Packages'
  }
  return nameMap[platform] || platform
}
</script>