<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
useHead({
  titleTemplate: (titleChunk) => titleChunk ? `${titleChunk} from pavi2410's toolkit` : "pavi2410's toolkit",
})
</script>