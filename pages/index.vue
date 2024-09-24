<template>
  <div class="p-8">
    <h1 class="text-3xl font-semibold">
      <span class="text-5xl">🧰</span> pavi2410's toolkit
    </h1>
    <p>
      Here you can find a collection of tools that I have created to help you with your daily tasks.
    </p>

    <UDivider class="my-8" />

    <section class="flex flex-col gap-4">
      <h2 class="text-2xl font-semibold">
        Tools
      </h2>
      <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <li v-for="tool in tools" :key="tool.name">
          <ULink :to="tool.link">
            <UCard>
              <div class="text-5xl mb-2">
                {{ tool.icon }}
              </div>
              <div class="text-xl font-semibold">
                {{ tool.name }}
              </div>
              <div class="text-sm">
                {{ tool.summary }}
              </div>
            </UCard>
          </ULink>
        </li>
      </ul>
    </section>
  </div>
</template>

<script lang="ts" setup>
const tools = [
  {
    name: 'URL Inspector',
    summary: 'Inspect a URL and see its components',
    icon: '🕵️',
    link: '/tools/url-inspector',
  },
  {
    name: 'IP Inspector',
    summary: 'Inspect an IP address and see its components',
    icon: '🔍',
    link: '/tools/ip-inspector',
  },
  {
    name: 'Ditext',
    summary: 'Convert text to different cases',
    icon: '🔠',
    link: '/tools/ditext',
  },
  {
    name: 'Name Checker',
    summary: 'Check if a name is available on various platforms',
    icon: '™️',
    link: '/tools/name-checker',
  },
]

useHead({
  link: [
    {
      rel: 'icon',
      href: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🧰</text></svg>`
    }
  ]
})
</script>

<style></style>