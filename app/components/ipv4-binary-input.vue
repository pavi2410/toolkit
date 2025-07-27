<template>
  <div class="counter">
    <UButtonGroup>
      <UButton color="gray" variant="solid" class="bit" v-for="i in 8" :key="i" @click="toggleBit(32 - i)">
        {{ getBit(32 - i) }}
      </UButton>
    </UButtonGroup>
    &bullet;
    <UButtonGroup>
      <UButton color="gray" variant="solid" class="bit" v-for="i in 8" :key="i" @click="toggleBit(24 - i)">
        {{ getBit(24 - i) }}
      </UButton>
    </UButtonGroup>
    &bullet;
    <UButtonGroup>
      <UButton color="gray" variant="solid" class="bit" v-for="i in 8" :key="i" @click="toggleBit(16 - i)">
        {{ getBit(16 - i) }}
      </UButton>
    </UButtonGroup>
    &bullet;
    <UButtonGroup>
      <UButton color="gray" variant="solid" class="bit" v-for="i in 8" :key="i" @click="toggleBit(8 - i)">
        {{ getBit(8 - i) }}
      </UButton>
    </UButtonGroup>
  </div>
</template>

<script lang="ts" setup>
const ipAddr = defineModel<number>({ required: true })

function getBit(i: number) {
  return (ipAddr.value >> i) & 1
}

function toggleBit(i: number) {
  ipAddr.value = ipAddr.value ^ (1 << i)
}
</script>

<style scoped>
.counter {
  counter-reset: reversed(bit-index) 32;

  .bit {
    counter-increment: bit-index -1;
    position: relative;

    &:nth-child(9n + 1):before {
      content: counter(bit-index);
      position: absolute;
      right: 4px;
      top: -20px;
      opacity: 0.5;
    }
  }

  &:hover {
    .bit:nth-child(9n + 1):before {
      opacity: 1;
    }

    .bit:before {
      content: counter(bit-index);
      position: absolute;
      right: 4px;
      top: -20px;
      opacity: 0.5;
    }
  }
}
</style>