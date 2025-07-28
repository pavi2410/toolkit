<template>
  <NuxtLayout name="tool-layout" emoji="🔠" toolName="Ditext">
    <template #header>
      <div class="flex gap-4 items-center flex-wrap">
        <USelect v-model="strategy" :items="strategyOptions" size="sm" />
        <UCheckbox v-model="ignoreCase" label="Ignore Case" />
        <UCheckbox v-model="ignoreWhitespace" label="Ignore Whitespace" />
      </div>
    </template>

    <div class="h-[calc(100vh-theme(spacing.12))] grid grid-rows-[1fr_auto_1fr] gap-4 p-4">
      <!-- Top row: Two textareas with swap button -->
      <div class="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
        <diff-textarea v-model="textA" placeholder="Text A" class="h-full" />
        <div class="flex justify-center md:self-center">
          <UTooltip text="Swap texts">
            <UButton size="sm" variant="outline" icon="i-tabler-arrows-left-right" @click="swapTexts"
              class="rotate-90 md:rotate-0" />
          </UTooltip>
        </div>
        <diff-textarea v-model="textB" placeholder="Text B" class="h-full" />
      </div>

      <!-- Middle row: Stats and controls -->
      <div class="flex justify-between items-center">
        <p class="opacity-50 text-xs uppercase">
          Changes {{ diff.length }} &bullet; Added {{ diffAdded }} &bullet; Removed {{ diffRemoved }}
        </p>
        <UButton size="xs" variant="ghost" icon="i-tabler-clipboard" @click="copyDiffToClipboard">
          Copy Diff
        </UButton>
      </div>

      <!-- Bottom row: Unified diff view -->
      <UCard class="text-sm font-mono overflow-hidden" :ui="{ body: '!p-0' }">
        <!-- Line-based diff for line strategy -->
        <DiffViewer v-if="strategy === 'line'" :lines="unifiedDiffLines" />

        <!-- Inline diff for character and word strategies -->
        <InlineDiffViewer v-else :diff="diff" />
      </UCard>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: false,
})

import { diffChars, diffLines, diffWords, diffWordsWithSpace } from 'diff';

const strategyOptions = [
  { label: 'Character', value: 'char' },
  { label: 'Word', value: 'word' },
  { label: 'Line', value: 'line' }
] as const;

const strategy = ref<typeof strategyOptions[number]['value']>('char')
const ignoreCase = ref(false)
const ignoreWhitespace = ref(false)

const textA = ref('detect\ndiff text')
const textB = ref('ditext\nditext')

const diff = computed(() => {
  const options = {
    ignoreCase: ignoreCase.value,
    ignoreWhitespace: ignoreWhitespace.value
  }

  switch (strategy.value) {
    case 'line':
      return diffLines(textA.value, textB.value, options)
    case 'word': {
      if (options.ignoreWhitespace) {
        return diffWordsWithSpace(textA.value, textB.value, options)
      }
      return diffWords(textA.value, textB.value, options)
    }
    case 'char':
      return diffChars(textA.value, textB.value, options)
  }
})

const diffAdded = computed(() => diff.value.filter(part => part.added).length)
const diffRemoved = computed(() => diff.value.filter(part => part.removed).length)

const unifiedDiffLines = computed(() => {
  const lines = []
  let oldLineNumber = 1
  let newLineNumber = 1

  for (const part of diff.value) {
    const partLines = part.value.split('\n')

    for (let i = 0; i < partLines.length; i++) {
      const line = partLines[i]

      // Skip empty lines at the end of parts
      if (i === partLines.length - 1 && line === '') continue

      if (part.added) {
        lines.push({
          type: 'added',
          content: line,
          prefix: '+',
          oldLineNumber: null,
          newLineNumber: newLineNumber++
        })
      } else if (part.removed) {
        lines.push({
          type: 'removed',
          content: line,
          prefix: '-',
          oldLineNumber: oldLineNumber++,
          newLineNumber: null
        })
      } else {
        lines.push({
          type: 'unchanged',
          content: line,
          prefix: ' ',
          oldLineNumber: oldLineNumber++,
          newLineNumber: newLineNumber++
        })
      }
    }
  }

  return lines
})

const swapTexts = () => {
  const temp = textA.value
  textA.value = textB.value
  textB.value = temp
}

const copyDiffToClipboard = async () => {
  const diffText = unifiedDiffLines.value.map(line =>
    `${line.prefix}${line.content}`
  ).join('\n')

  try {
    await navigator.clipboard.writeText(diffText)
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
  }
}
</script>

<style></style>