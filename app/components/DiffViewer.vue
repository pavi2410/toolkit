<template>
  <div class="h-full overflow-auto">
    <div v-for="(line, index) in lines" :key="index" class="flex">
      <!-- Line number gutters -->
      <div class="flex bg-neutral-50 dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700">
        <div class="w-12 px-2 py-0.5 text-xs text-neutral-500 text-right border-r border-neutral-200 dark:border-neutral-700">
          {{ line.oldLineNumber || '' }}
        </div>
        <div class="w-12 px-2 py-0.5 text-xs text-neutral-500 text-right">
          {{ line.newLineNumber || '' }}
        </div>
      </div>
      <!-- Diff content -->
      <div 
        :class="{
          'bg-green-100 dark:bg-green-900/30': line.type === 'added',
          'bg-red-100 dark:bg-red-900/30': line.type === 'removed',
          'bg-transparent': line.type === 'unchanged'
        }"
        class="flex-1 px-3 py-0.5 whitespace-pre-wrap break-words"
      >
        <span class="inline-block w-4">{{ line.prefix }}</span>{{ line.content }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface DiffLine {
  type: 'added' | 'removed' | 'unchanged'
  content: string
  prefix: string
  oldLineNumber: number | null
  newLineNumber: number | null
}

defineProps<{
  lines: DiffLine[]
}>()
</script>