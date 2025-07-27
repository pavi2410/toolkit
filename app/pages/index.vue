<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/10 dark:to-purple-400/10"></div>
      <div class="relative max-w-7xl mx-auto px-6 py-24 sm:py-32">
        <div class="text-center">
          <div class="inline-flex items-center justify-center p-4 mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg">
            <span class="text-6xl">🧰</span>
          </div>
          <h1 class="text-5xl sm:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            pavi2410's
            <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Developer Toolkit</span>
          </h1>
          <p class="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A curated collection of professional tools designed to streamline your development workflow and boost productivity.
          </p>
        </div>
      </div>
    </div>

    <!-- Tools Section -->
    <div class="max-w-7xl mx-auto px-6 py-24">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Available Tools
        </h2>
        <p class="text-lg text-slate-600 dark:text-slate-300">
          Choose from our selection of specialized development utilities
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ToolCard
          v-for="tool in tools"
          :key="tool.name"
          :tool="tool"
        />
      </div>
    </div>

    <!-- Footer -->
    <div class="border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <div class="text-center text-sm text-slate-500 dark:text-slate-400">
          Handcrafted and vibe-coded by <a href="https://pavi2410.com" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">pavi2410</a>
        </div>
      </div>
    </div>
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
  {
    name: 'Speedrun',
    summary: 'Benchmark Javascript code',
    icon: '🏎️',
    link: '/tools/speedrun',
  },
  {
    name: 'Spaghetti',
    summary: 'Visual programming tool for creating interactive experiences',
    icon: '🍝',
    link: 'http://spaghetti.pavi2410.com/',
    external: true,
  }
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