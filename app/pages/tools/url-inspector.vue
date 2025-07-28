<template>
  <NuxtLayout name="tool-layout" emoji="🕵️" toolName="URL Inspector">
    <UInput v-model="url" placeholder="Type an URL here..." :ui="{ root: 'w-full p-8', trailing: 'end-8' }">
      <template #trailing v-if="url.length > 0">
        {{ valid ? '✅' : '❌' }}
      </template>
    </UInput>

    <UTable v-if="valid" :columns="columns" :data="tableData">
      <template #expanded="{ row }">
        <UTable :columns="row.original.expand.columns" :data="row.original.expand.rows"
          v-if="row.original.property === 'search'" />
      </template>
    </UTable>
  </NuxtLayout>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: false,
})

const route = useRoute();

const url = ref<string>(route.hash.slice(1));

const valid = computed(() => URL.canParse(url.value))

const columns = [
  {
    accessorKey: 'property',
    header: 'Property',
  },
  {
    accessorKey: 'value',
    header: 'Value',
  },
]

const searchColumns = [
  {
    accessorKey: 'key',
    header: 'Key',
  },
  {
    accessorKey: 'value',
    header: 'Value',
  },
]

const tableData = computed(() => {
  if (!valid.value) return []

  const _url = new URL(url.value)

  const keys = [
    'href',
    'origin',
    'protocol',
    'username',
    'password',
    'hostname',
    'port',
    'pathname',
    'hash'
  ] as const;

  const props = keys.filter((k) => Boolean(_url[k])).map((k) => ({ property: k, value: _url[k] }));

  const search = (_url.searchParams.size > 0) ? [{
    property: 'search',
    value: _url.search,
    expand: {
      columns: searchColumns,
      rows: [..._url.searchParams.entries()].map(([key, value]) => ({ key, value })),
    }
  }] : [];

  return [
    ...props,
    ...search,
  ]
})
</script>

<style></style>