<script setup lang="ts">
definePageMeta({
  layout: false,
})

useHead({
  title: 'Name Checker',
  link: [
    {
      rel: 'icon',
      href: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">™️</text></svg>`
    }
  ]
})

import { ref } from 'vue';

interface SearchResult {
  name: string;
  available: boolean | null;
  platform: string;
}

interface DomainResult {
  name: string;
  available: boolean;
  domain: string;
  priceInCents: number;
}

const searchName = ref('')
const results = ref<SearchResult[]>([])
const domainResults = ref<DomainResult[]>([])
const isLoading = ref(false)
const error = ref('')

const platforms = [
  'GitHub repo', 'GitHub org/user', 'GitLab project', 'PyPI package',
  'Homebrew cask/formula', 'apt package', 'Rust crate', 'Maven package',
  'npm package', 'npm org', 'Ruby gem', 'Nuget package', 'Packagist package', 'Go package'
] as const

const checkAvailability = async (name: string, platform: typeof platforms[number]): Promise<boolean> => {
  const { data } = await useFetch(`/api/fetchNameAvailability?name=${name}&platform=${platform}`);
  return data.value ?? false
}

const getPlatformLink = (name: string, platform: typeof platforms[number]): string => {
  switch (platform) {
    case 'GitHub repo':
      return `https://github.com/${name}`;
    case 'GitHub org/user':
      return `https://github.com/${name}`;
    case 'GitLab project':
      return `https://gitlab.com/${name}`;
    case 'PyPI package':
      return `https://pypi.org/project/${name}`;
    case 'Homebrew cask/formula':
      return `https://formulae.brew.sh/formula/${name}`;
    case 'apt package':
      return `https://packages.ubuntu.com/search?keywords=${name}`;
    case 'Rust crate':
      return `https://crates.io/crates/${name}`;
    case 'Maven package':
      return `https://search.maven.org/search?q=g:${name}`;
    case 'npm package':
      return `https://www.npmjs.com/package/${name}`;
    case 'npm org':
      return `https://www.npmjs.com/org/${name}`;
    case 'Ruby gem':
      return `https://rubygems.org/gems/${name}`;
    case 'Nuget package':
      return `https://www.nuget.org/packages/${name}`;
    case 'Packagist package':
      return `https://packagist.org/packages/${name}`;
    case 'Go package':
      return `https://pkg.go.dev/${name}`;
    default:
      return '#';
  }
}

const domains = [
  'com', 'net', 'org', 'io', 'dev', 'app', 'in',
  'tech', 'co', 'ai', 'xyz', 'me', 'ing',
] as const

const checkDomainAvailability = async (name: string, domain: typeof domains[number]): Promise<{
  available: boolean,
  priceInCents: number,
}> => {
  const { data } = await useFetch(`/api/fetchDomainAvailability?name=${name}&domain=${domain}`);

  return data.value ?? ({ available: false, priceInCents: 0 })
}

const searchNames = async () => {
  if (!searchName.value.trim()) {
    error.value = 'Please enter a name to search.'
    return
  }

  isLoading.value = true
  error.value = ''
  results.value = []
  domainResults.value = []

  try {
    const platformChecks = platforms.map(async (platform) => {
      const available = await checkAvailability(searchName.value, platform)
      return { name: searchName.value, available, platform }
    })

    const domainChecks = domains.map(async (domain) => {
      const { available, priceInCents } = await checkDomainAvailability(searchName.value, domain)
      return { name: searchName.value, available, domain, priceInCents }
    })

    results.value = await Promise.all(platformChecks)
    domainResults.value = await Promise.all(domainChecks)
  } catch (err) {
    error.value = 'An error occurred while fetching results. Please try again.'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <NuxtLayout name="tool-layout">
    <template #header>
      ™️ Name Checker
    </template>

    <div class="flex flex-col items-center justify-center p-4">
      <h1 class="text-3xl font-bold mb-2">Name Checker</h1>
      <p class="mb-6">Find out if your project name is taken</p>

      <div class="flex flex-col gap-4">
        <UButtonGroup size="lg" class="w-full">
          <UInput v-model.trim="searchName" @keyup.enter="searchNames" placeholder="Type some name..." class="w-full" />
          <UButton icon="i-heroicons-magnifying-glass" color="gray" :loading="isLoading" @click="searchNames" />
        </UButtonGroup>

        <p v-if="error" class="text-red-500">{{ error }}</p>

        <div class="grid grid-cols-2 gap-4">
          <div v-if="results.length > 0" class="flex flex-col gap-2">
            <h2 class="text-xl font-bold mb-2">Name Availability</h2>
            <div v-for="(result, index) in results" :key="index" class="flex items-center">
              <span :class="result.available ? 'text-green-500' : 'text-red-500'" class="mr-2">
                {{ result.available ? '✓' : '✗' }}
              </span>
              <span>
                <a :href="getPlatformLink(result.name, result.platform)" target="_blank"
                  class="text-blue-400 hover:underline">
                  {{ result.platform }}
                </a>
              </span>
              <span v-if="!result.available" class="ml-1 text-gray-400">
                already exists
              </span>
              <span v-else class="ml-1 text-gray-400">
                is available!
              </span>
            </div>
          </div>

          <div v-if="domainResults.length > 0" class="flex flex-col gap-2">
            <h2 class="text-xl font-bold mb-2">Domain Availability</h2>
            <div v-for="(result, index) in domainResults" :key="index" class="flex items-center">
              <span :class="result.available ? 'text-green-500' : 'text-red-500'" class="mr-2">
                {{ result.available ? '✓' : '✗' }}
              </span>
              <span>
                <a :href="`https://${result.name}.${result.domain}`" target="_blank"
                  class="text-blue-400 hover:underline">
                  {{ result.name }}.{{ result.domain }}
                </a>
              </span>
              <span v-if="!result.available" class="ml-1 text-gray-400">
                already exists
              </span>
              <span v-else class="ml-1 text-gray-400">
                is available for ${{ (result.priceInCents / 100).toFixed(2) }}!
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
