<template>
  <UInput v-model="formattedIpAddr" />
</template>

<script lang="ts" setup>
const ipAddr = defineModel<number>({ required: true })

function getOctet(i: number) {
  return (ipAddr.value >> ((3 - i) * 8)) & 0xff
}

function setOctet(i: number, value: number) {
  ipAddr.value = ipAddr.value & ~(0xff << ((3 - i) * 8)) | (value << ((3 - i) * 8))
}

const formattedIpAddr = computed({
  get() {
    return `${getOctet(0)}.${getOctet(1)}.${getOctet(2)}.${getOctet(3)}`
  },
  set(value: string) {
    const octets = value.split('.').map(Number)
    for (let i = 0; i < 4; i++) {
      setOctet(i, octets[i])
    }
  }
})
</script>

<style></style>