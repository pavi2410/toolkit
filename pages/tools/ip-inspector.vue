<template>
  <NuxtLayout name="tool-layout">
    <template #header>
      🔍 IP Inspector
    </template>
    lol
  </NuxtLayout>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: false,
})

useHead({
  title: 'IP Inspector',
  link: [
    {
      rel: 'icon',
      href: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🔍</text></svg>`
    }
  ]
})
</script>

<style></style>