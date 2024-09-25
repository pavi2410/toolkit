<template>
  <NuxtLayout name="tool-layout" emoji="🔠" toolName="Ditext">
    <template #header>
      <div class="flex gap-4 items-center">
        <USelect v-model="strategy" :options="strategyOptions" size="xs" />
        <UCheckbox v-model="ignoreCase" label="Ignore Case" />
      </div>
    </template>

    <div class="flex gap-2 *:flex-grow *:flex-shrink-0 items-stretch p-4">
      <diff-textarea v-model="textA" placeholder="Text A" />
      <diff-textarea v-model="textB" placeholder="Text B" />
      <div>
        <p class="opacity-50 text-xs uppercase px-1">
          Changes {{ diff.length }} &bullet; Added {{ diffAdded }} &bullet; Removed {{ diffRemoved }}
        </p>
        <UCard class="text-sm font-mono" :ui="{ body: { padding: '!p-2' } }">
          <span v-for="(part, index) in diff" :key="index"
            :style="{ backgroundColor: part.added ? '#0f07' : part.removed ? '#f007' : 'transparent' }"
            class="whitespace-pre" v-text="part.value" />
        </UCard>
      </div>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: false,
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