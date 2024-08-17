<template>
  <div class="flex flex-col gap-4">
    <ULink to="/" class="pl-2">⬅️ pavi2410's toolkit</ULink>

    <h1 class="text-2xl font-sembold pl-4">
      🕵️ URL Inspector
    </h1>

    <UInput v-model="url" placeholder="Type an URL here...">
      <template #trailing v-if="url.length > 0">
        {{ valid ? '✅' : '❌' }}
      </template>
    </UInput>

    <div>
      <UTable v-if="valid" :columns="tableData.columns" :rows="tableData.rows">
        <template #expand="{ row }">
          <UTable :columns="row.expand.columns" :rows="row.expand.rows" v-if="row.property === 'search'" />
        </template>
      </UTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();

const url = ref<string>(route.hash.slice(1));

const valid = computed(() => URL.canParse(url.value))

const tableData = computed(() => {
  if (!valid.value) return null

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
      columns: [
        {
          key: 'key',
          label: 'Key',
        },
        {
          key: 'value',
          label: 'Value',
        },
      ],
      rows: [..._url.searchParams.entries()].map(([key, value]) => ({ key, value })),
    }
  }] : [];

  return {
    columns: [
      {
        key: 'property',
        label: 'Property',
      },
      {
        key: 'value',
        label: 'Value',
      },
    ],
    rows: [
      ...props,
      ...search,
    ]
  }
})
</script>

<style></style>