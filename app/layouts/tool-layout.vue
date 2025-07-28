<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

const attrs = useAttrs()

const items = [
  {
    label: "pavi2410's toolkit",
    icon: '⬅️',
    to: '/'
  },
  {
    label: attrs.toolName as string,
    icon: attrs.emoji as string,
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
  <header class="flex flex-wrap justify-between px-4 py-2 border-b dark:border-neutral-700">
    <UBreadcrumb :items>
      <template #item-leading="{ item }">
        {{ item.icon }}
      </template>
    </UBreadcrumb>

    <slot name="header" />
  </header>

  <slot />
</template>
