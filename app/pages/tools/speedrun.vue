<script lang="ts" setup>
import { ref } from 'vue';

type BenchResult = {
  name: string;
  time: number;
};

const setupCode = ref('');
const testCases = ref([{ code: '' }]);
const results = ref<BenchResult[]>([]);

function loadExample() {
  setupCode.value = `return Array.from({ length: 100000 }, (_, i) => i);`;
  testCases.value = [
    { code: `this.setup.reduce((acc, val) => acc + val, 0)` },
    {
      code: `let total = 0;
for (let i = 0; i < this.setup.length; i++) {
  total += this.setup[i];
}` },
  ];
}

const addTestCase = () => {
  testCases.value.push({ code: '' });
};

const removeTestCase = (index: number) => {
  testCases.value.splice(index, 1);
};

const runBenchmark = async () => {
  results.value = [];

  // Evaluate setup code
  const setupFn = new Function(setupCode.value);
  const globalData = setupFn();

  for (const testCase of testCases.value) {
    const caseDep = { setup: structuredClone(globalData) };
    // Evaluate test case code
    const start = performance.now();
    const testCaseFn = new Function(testCase.code).bind(caseDep);
    testCaseFn();
    const end = performance.now();

    results.value.push({
      name: `Test Case ${testCases.value.indexOf(testCase) + 1}`,
      time: end - start,
    });
  }
};
</script>

<template>
  <NuxtLayout name="tool-layout" emoji="🏎️" toolName="Speedrun">
    <ClientOnly>
      <div class="p-4 flex flex-col gap-2">
        <div class="flex gap-2">
          <UButton @click="loadExample">Load example</UButton>
          <UButton @click="runBenchmark">Run Benchmark</UButton>
        </div>

        <div class="flex flex-col gap-4">
          <div>
            <label for="setupCode">Setup Code:</label>
            <UTextarea id="setupCode" v-model="setupCode"></UTextarea>
          </div>
          <UButton @click="addTestCase">Add Test Case</UButton>
          <div class="grid grid-cols-3 gap-2">
            <UCard v-for="(testCase, index) in testCases" :key="index"
              :ui="{ base: 'flex flex-col', header: { padding: '!py-2 !px-4' }, body: { base: 'flex-grow-1 h-full', padding: '!p-4' }, footer: { padding: '!py-2 !px-4'} }">
              <template #header>
                <div class="flex justify-between items-center">
                  <h3>Test Case {{ index + 1 }}</h3>
                  <UButton @click="removeTestCase(index)" icon="i-heroicons-trash" square variant="ghost" />
                </div>
              </template>
              <template #footer>
                Time: {{ results[index]?.time }}ms
              </template>
              <UTextarea v-model="testCase.code" autoresize resize class="size-full" />
            </UCard>
          </div>
        </div>
      </div>
    </ClientOnly>
  </NuxtLayout>
</template>