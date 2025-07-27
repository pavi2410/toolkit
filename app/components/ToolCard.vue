<template>
  <ULink
    v-if="!tool.external"
    :to="tool.link"
    class="group block transition-transform duration-200 hover:scale-105 h-full"
  >
    <UCard class="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
      <template #header>
        <div class="flex items-center justify-center h-16 w-16 mx-auto bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl">
          <span class="text-3xl">{{ tool.icon }}</span>
        </div>
      </template>
      
      <div class="text-center space-y-3">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {{ tool.name }}
        </h3>
        <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {{ tool.summary }}
        </p>
      </div>

      <template #footer>
        <div class="flex items-center justify-center">
          <span class="text-xs font-medium text-blue-600 dark:text-blue-400 opacity-90 group-hover:opacity-100 transition-opacity">
            Try it now →
          </span>
        </div>
      </template>
    </UCard>
  </ULink>

  <a
    v-else
    :href="tool.link"
    target="_blank"
    rel="noopener noreferrer"
    class="group block transition-transform duration-200 hover:scale-105 h-full"
  >
    <UCard class="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
      <template #header>
        <div class="flex items-center justify-center h-16 w-16 mx-auto bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl">
          <span class="text-3xl">{{ tool.icon }}</span>
        </div>
      </template>
      
      <div class="text-center space-y-3">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {{ tool.name }}
        </h3>
        <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {{ tool.summary }}
        </p>
      </div>

      <template #footer>
        <div class="flex items-center justify-center">
          <span class="text-xs font-medium text-blue-600 dark:text-blue-400 opacity-90 group-hover:opacity-100 transition-opacity">
            Try it now →
          </span>
        </div>
      </template>
    </UCard>
  </a>
</template>

<script lang="ts" setup>
interface Tool {
  name: string
  summary: string
  icon: string
  link: string
  external?: boolean
}

defineProps<{
  tool: Tool
}>()
</script>