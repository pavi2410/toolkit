<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

const attrs = useAttrs()

const links = [
  {
    label: "pavi2410's toolkit",
    emoji: '⬅️',
    to: '/'
  },
  {
    label: attrs.toolName as string,
    emoji: attrs.emoji as string,
  },
]

useHead({
  title: attrs.toolName as string,
  link: [
    {
      rel: 'icon',
      href: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${attrs.emoji}</text></svg>`
    }
  ]
})
</script>

<template>
  <header class="flex justify-between px-4 py-2 border-b dark:border-neutral-700">
    <UBreadcrumb :links>
      <template #icon="{ link }">
        {{ link.emoji }}
      </template>
    </UBreadcrumb>

    <slot name="header" />
  </header>

  <slot />
</template>
