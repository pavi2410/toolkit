<template>
  <div class="h-full flex flex-col">
    <p class="opacity-50 text-xs uppercase px-1 mb-2">
      Chars {{ text.length }} &bullet; Words {{ words }} &bullet; Lines {{ lines }} &bullet; Size {{ size }}
    </p>
    <div class="flex-1 flex border border-neutral-200 dark:border-neutral-700 rounded-md overflow-hidden">
      <!-- Line numbers -->
      <div class="bg-neutral-50 dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 min-w-[3rem] flex-shrink-0">
        <div class="font-mono text-xs leading-5 text-neutral-500 text-right py-2">
          <div v-for="lineNum in lineNumbers" :key="lineNum" class="px-2 h-5">
            {{ lineNum }}
          </div>
        </div>
      </div>
      <!-- Text area -->
      <textarea
        v-model="text"
        :placeholder="placeholder"
        class="flex-1 resize-none border-0 bg-transparent font-mono text-sm leading-5 p-2 focus:ring-0 focus:outline-none"
        @scroll="syncScroll"
        ref="textareaRef"
      ></textarea>
    </div>
  </div>
</template>

<script lang="ts" setup>
import prettyBytes from 'pretty-bytes';

defineProps<{
  placeholder: string
}>()
const text = defineModel<string>({ required: true })
const textareaRef = ref<HTMLTextAreaElement>()

const words = computed(() => text.value.split(/\s+/).filter(w => w.length > 0).length)
const lines = computed(() => text.value.split('\n').length)
const lineNumbers = computed(() => {
  const lineCount = text.value.split('\n').length
  return Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1)
})
const size = computed(() => prettyBytes(text.value.length))

const syncScroll = () => {
  // This could be used to sync scroll between line numbers and textarea
  // For now, CSS handles the alignment
}
</script>

<style></style>