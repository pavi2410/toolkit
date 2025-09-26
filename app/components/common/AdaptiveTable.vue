<template>
  <div class="overflow-x-auto">
    <!-- Desktop/Landscape Layout -->
    <table v-if="!shouldTranspose" class="w-full text-sm">
      <thead>
        <tr class="border-b border-neutral-200 dark:border-neutral-700">
          <th class="text-left p-2 font-semibold text-neutral-600 dark:text-neutral-400">
            {{ rowHeaderLabel }}
          </th>
          <th
            v-for="colHeader in columnHeaders"
            :key="colHeader"
            class="text-center p-1 font-semibold text-neutral-600 dark:text-neutral-400 min-w-[3rem]"
          >
            {{ colHeader }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(rowHeader, rowIndex) in rowHeaders"
          :key="rowHeader"
          class="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
        >
          <td class="p-2 font-mono text-neutral-700 dark:text-neutral-300 font-medium">
            {{ rowHeader }}
          </td>
          <td
            v-for="(colHeader, colIndex) in columnHeaders"
            :key="colHeader"
            class="text-center p-1"
          >
            <slot
              name="cell"
              :row-header="rowHeader"
              :col-header="colHeader"
              :row-index="rowIndex"
              :col-index="colIndex"
              :is-transposed="false"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Mobile/Portrait Layout (Transposed) -->
    <table v-else class="w-full text-sm">
      <thead>
        <tr class="border-b border-neutral-200 dark:border-neutral-700">
          <th class="text-left p-2 font-semibold text-neutral-600 dark:text-neutral-400">
            {{ columnHeaderLabel }}
          </th>
          <th
            v-for="rowHeader in rowHeaders"
            :key="rowHeader"
            class="text-center p-1 font-semibold text-neutral-600 dark:text-neutral-400 min-w-[3rem]"
          >
            {{ rowHeader }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(colHeader, colIndex) in columnHeaders"
          :key="colHeader"
          class="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
        >
          <td class="p-2 font-mono text-neutral-700 dark:text-neutral-300 font-medium">
            {{ colHeader }}
          </td>
          <td
            v-for="(rowHeader, rowIndex) in rowHeaders"
            :key="rowHeader"
            class="text-center p-1"
          >
            <slot
              name="cell"
              :row-header="rowHeader"
              :col-header="colHeader"
              :row-index="rowIndex"
              :col-index="colIndex"
              :is-transposed="true"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'

interface Props {
  rowHeaders: string[]
  columnHeaders: string[]
  rowHeaderLabel?: string
  columnHeaderLabel?: string
  autoTranspose?: boolean
  transposeBreakpoint?: keyof typeof breakpointsTailwind
  forceOrientation?: 'auto' | 'portrait' | 'landscape'
}

const props = withDefaults(defineProps<Props>(), {
  rowHeaderLabel: 'Row',
  columnHeaderLabel: 'Column',
  autoTranspose: true,
  transposeBreakpoint: 'md',
  forceOrientation: 'auto'
})

const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller(props.transposeBreakpoint)

const shouldTranspose = computed(() => {
  if (props.forceOrientation === 'portrait') return true
  if (props.forceOrientation === 'landscape') return false

  if (!props.autoTranspose) return false

  // On mobile, transpose if we have more columns than rows (better for portrait)
  if (isMobile.value) {
    return props.columnHeaders.length > props.rowHeaders.length
  }

  return false
})
</script>