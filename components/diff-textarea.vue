<template>
  <div>
    <p class="opacity-50 text-sm uppercase px-1">
      Chars {{ text.length }} &bullet; Words {{ words }} &bullet; Lines {{ lines }} &bullet; Size {{ size }}
    </p>
    <UTextarea autoresize v-model="text" :placeholder="$props.placeholder" />
  </div>
</template>

<script lang="ts" setup>
import prettyBytes from 'pretty-bytes';

defineProps<{
  placeholder: string
}>()
const text = defineModel<string>({ required: true })

const words = computed(() => text.value.split(/\s+/).length)
const lines = computed(() => text.value.split('\n').length)
const size = computed(() => prettyBytes(text.value.length))
</script>

<style></style>