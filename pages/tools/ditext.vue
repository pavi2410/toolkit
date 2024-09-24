<template>
  <NuxtLayout name="tool-layout">
    <template #header>
      <div class="flex justify-between">
        <span>🔠 Ditext</span>
        <div class="flex gap-4 items-center pr-4">
          <USelect v-model="strategy" :options="strategyOptions" size="xs" />
          <UCheckbox v-model="ignoreCase" label="Ignore Case" />
        </div>
      </div>
    </template>

    <div class="flex gap-2 *:flex-shrink-0 items-stretch px-4">
      <diff-textarea v-model="textA" placeholder="Text A" />
      <diff-textarea v-model="textB" placeholder="Text B" />
      <div>
        <p class="opacity-50 text-xs uppercase px-1">
          Changes {{ diff.length }} &bullet; Added {{ diffAdded }} &bullet; Removed {{ diffRemoved }}
        </p>
        <div class="whitespace-pre overflow-x-scroll border rounded p-2 text-sm font-mono">
          <span v-for="(part, index) in diff" :key="index"
            :style="{ backgroundColor: part.added ? '#0f07' : part.removed ? '#f007' : 'transparent' }">
            {{ part.value }}
          </span>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: false,
})

useHead({
  title: 'Ditext',
  link: [
    {
      rel: 'icon',
      href: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🔠</text></svg>`
    }
  ]
})

import { diffChars, diffLines, diffWords } from 'diff';

const strategyOptions = [
  { label: 'Character', value: 'char' },
  { label: 'Word', value: 'word' },
  { label: 'Line', value: 'line' }
] as const;

const strategy = ref<typeof strategyOptions[number]['value']>('char')
const ignoreCase = ref(false)

const textA = ref('detect\ndiff text')
const textB = ref('ditext\nditext')

const diff = computed(() => {
  const options = {
    ignoreCase: ignoreCase.value
  }

  switch (strategy.value) {
    case 'line':
      return diffLines(textA.value, textB.value, options)
    case 'word':
      return diffWords(textA.value, textB.value, options)
    default:
      return diffChars(textA.value, textB.value, options)
  }
})

const diffAdded = computed(() => diff.value.filter(part => part.added).length)
const diffRemoved = computed(() => diff.value.filter(part => part.removed).length)
</script>

<style></style>