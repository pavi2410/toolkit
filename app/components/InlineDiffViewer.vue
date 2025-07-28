<template>
  <div class="h-full overflow-auto">
    <div v-for="(line, lineIndex) in processedLines" :key="lineIndex" class="flex">
      <!-- Line number gutters -->
      <div class="flex bg-neutral-50 dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 flex-shrink-0">
        <div class="w-12 px-2 py-0.5 text-xs text-neutral-500 text-right border-r border-neutral-200 dark:border-neutral-700">
          {{ line.oldLineNumber || '' }}
        </div>
        <div class="w-12 px-2 py-0.5 text-xs text-neutral-500 text-right">
          {{ line.newLineNumber || '' }}
        </div>
      </div>
      <!-- Diff content with inline highlighting -->
      <div class="flex-1 px-3 py-0.5 leading-5">
        <span v-for="(part, partIndex) in line.parts" :key="partIndex"
          :class="{
            'bg-green-200 dark:bg-green-900/50': part.added,
            'bg-red-200 dark:bg-red-900/50': part.removed,
            'bg-transparent': !part.added && !part.removed
          }"
          class="whitespace-pre-wrap break-words"
          v-text="part.value"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface DiffPart {
  value: string
  added?: boolean
  removed?: boolean
}

interface ProcessedLine {
  parts: DiffPart[]
  oldLineNumber: number | null
  newLineNumber: number | null
}

const props = defineProps<{
  diff: DiffPart[]
}>()

const processedLines = computed(() => {
  const lines: ProcessedLine[] = []
  let currentLine: DiffPart[] = []
  let oldLineNumber = 1
  let newLineNumber = 1
  
  for (const part of props.diff) {
    const partLines = part.value.split('\n')
    
    for (let i = 0; i < partLines.length; i++) {
      const lineContent = partLines[i]
      
      if (i > 0) {
        // New line encountered, finalize current line
        if (currentLine.length > 0) {
          lines.push({
            parts: [...currentLine],
            oldLineNumber: hasOldContent(currentLine) ? oldLineNumber++ : null,
            newLineNumber: hasNewContent(currentLine) ? newLineNumber++ : null
          })
        }
        currentLine = []
        
        // Handle line number increments for empty lines
        if (lineContent === '' && i === partLines.length - 1) {
          // This is the final empty line of a part, don't create a new line
          continue
        }
      }
      
      if (lineContent !== '' || i === 0) {
        currentLine.push({
          value: lineContent,
          added: part.added,
          removed: part.removed
        })
      }
    }
  }
  
  // Add the final line if it exists
  if (currentLine.length > 0) {
    lines.push({
      parts: currentLine,
      oldLineNumber: hasOldContent(currentLine) ? oldLineNumber : null,
      newLineNumber: hasNewContent(currentLine) ? newLineNumber : null
    })
  }
  
  return lines
})

const hasOldContent = (parts: DiffPart[]) => {
  return parts.some(part => !part.added)
}

const hasNewContent = (parts: DiffPart[]) => {
  return parts.some(part => !part.removed)
}
</script>