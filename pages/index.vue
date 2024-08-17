<template>
  <div class="p-8">
    <h1 class="text-3xl font-semibold">
      pavi2410's toolkit
    </h1>
    <p>
      Here you can find a collection of tools that I have created to help you with your daily tasks.
    </p>

    <UDivider class="my-8" />

    <section class="flex flex-col gap-4">
      <h2 class="text-2xl font-semibold">
        Tools
      </h2>
      <ul class="flex gap-8 *:flex-1">
        <li v-for="tool in tools" :key="tool.name">
          <ULink :to="tool.link">
            <div class="flex flex-col border rounded p-4">
              <div class="text-5xl mb-2">
                {{ tool.icon }}
              </div>
              <div class="text-xl font-semibold">
                {{ tool.name }}
              </div>
              <div class="text-sm">
                {{ tool.summary }}
              </div>
            </div>
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
  }
]
</script>

<style></style>