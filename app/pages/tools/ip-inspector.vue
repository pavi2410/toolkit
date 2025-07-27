<template>
  <NuxtLayout name="tool-layout" emoji="🔍" toolName="IP Inspector">
    <div class="flex flex-col gap-8 p-4 items-center">
      <Ipv4DecimalInput v-model="ipAddr" />
      <Ipv4BinaryInput v-model="ipAddr" />

      <table class="[&_th]:text-right [&_td]:tabular-nums border-separate border-spacing-4">
        <tbody>
          <tr>
            <th>Raw decimal value</th>
            <td>{{ Number(ipAddr & 0xffffffffff) }}</td>
          </tr>
          <tr>
            <th>Address Class</th>
            <td>{{ addrClass }}</td>
          </tr>
          <tr>
            <th>Private Address</th>
            <td>{{ isPrivate ? '✅' : '❌' }}</td>
          </tr>
          <tr>
            <th>Loopback Address</th>
            <td>{{ isLoopback ? '✅' : '❌' }}</td>
          </tr>
          <tr>
            <th>Multicast</th>
            <td>{{ isMulticast ? '✅' : '❌' }}</td>
          </tr>
          <tr>
            <th>Network Mask</th>
            <td>{{ formatIpv4(netMask) }}</td>
          </tr>
          <tr>
            <th>Network Address / NID</th>
            <td>{{ formatIpv4(netAddr) }}</td>
          </tr>
          <tr>
            <th>Host Address / HID</th>
            <td>{{ formatIpv4(hostAddr) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import Ipv4BinaryInput from '~/components/ipv4-binary-input.vue';
import Ipv4DecimalInput from '~/components/ipv4-decimal-input.vue';

definePageMeta({
  layout: false,
})

const route = useRoute()

const ipAddr = ref(route.hash ? parseIpv4(route.hash.slice(1)) : 0);

const firstOctet = computed(() => (ipAddr.value >> 24) & 0xff);
const secondOctet = computed(() => (ipAddr.value >> 16) & 0xff);

const addrClass = computed(() => {
  if (firstOctet.value >> 7 === 0) return 'A';
  if (firstOctet.value >> 6 === 0b10) return 'B';
  if (firstOctet.value >> 5 === 0b110) return 'C';
  if (firstOctet.value >> 4 === 0b1110) return 'D';
  return 'E';
})

// TODO: probably group private and loopback into one method
const isPrivate = computed(() => {
  switch (addrClass.value) {
    case 'A':
      return firstOctet.value === 10;
    case 'B':
      return firstOctet.value === 172 && secondOctet.value >= 16 && secondOctet.value <= 31;
    case 'C':
      return firstOctet.value === 192 && secondOctet.value === 168;
    default:
      return false;
  }
})

const isLoopback = computed(() => {
  return firstOctet.value === 127;
})

const isMulticast = computed(() => {
  return addrClass.value === 'D';
})

const netMask = computed(() => {
  switch (addrClass.value) {
    case 'A':
      return 0xff000000; // 255.0.0.0
    case 'B':
      return 0xffff0000; // 255.255.0.0
    case 'C':
      return 0xffffff00; // 255.255.255.0
    default:
      return null;
  }
})

const netAddr = computed(() => {
  if (!netMask.value) return null;
  return ipAddr.value & netMask.value;
})

const hostAddr = computed(() => {
  if (!netMask.value) return null;
  return ipAddr.value & ~netMask.value;
})

function formatIpv4(ip: number | null) {
  if (ip === null) return '-';
  return `${(ip >> 24) & 0xff}.${(ip >> 16) & 0xff}.${(ip >> 8) & 0xff}.${ip & 0xff}`;
}

function parseIpv4(ip: string) {
  const octets = ip.split('.').map(Number);
  return (octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3];
}
</script>

<style></style>