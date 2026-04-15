import type { FileContent, FileDescriptor } from './types'

export const fileDescriptors: readonly FileDescriptor[] = [
  {
    name: 'index.html',
    label: 'Markup',
    detail: 'Structure the preview surface and wire your targets.',
    chip: 'HTML',
  },
  {
    name: 'style.css',
    label: 'Styles',
    detail: 'Shape the canvas, layout, and visual tone.',
    chip: 'CSS',
  },
  {
    name: 'script.js',
    label: 'Behavior',
    detail: 'Add interaction, state, and console output.',
    chip: 'JS',
  },
] as const

export const initialFiles: FileContent = {
  'index.html': `<main class="stage">
  <p class="eyebrow">Toolkit x Deco</p>
  <h1>Ship a quick browser idea.</h1>
  <p class="lede">Edit the HTML, CSS, and JS files to prototype a focused UI without leaving the workspace.</p>
  <button id="pulse-button" type="button">Press me</button>
  <section class="card-stack">
    <article class="card">Live preview</article>
    <article class="card">Console relay</article>
    <article class="card">Three-file loop</article>
  </section>
</main>`,
  'style.css': `:root {
  color-scheme: dark;
  font-family: "Georgia", "Iowan Old Style", serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(253, 230, 138, 0.14), transparent 28%),
    linear-gradient(160deg, #10151f 0%, #182436 52%, #0d1119 100%);
  color: #f6f2e8;
}

.stage {
  display: grid;
  gap: 1rem;
  padding: 3rem;
}

.eyebrow {
  margin: 0;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  font-size: 0.72rem;
  color: #f3c969;
}

h1 {
  margin: 0;
  max-width: 10ch;
  font-size: clamp(2.8rem, 8vw, 5.6rem);
  line-height: 0.92;
}

.lede {
  margin: 0;
  max-width: 34rem;
  font-family: "Trebuchet MS", sans-serif;
  font-size: 1.05rem;
  line-height: 1.6;
  color: rgba(246, 242, 232, 0.76);
}

#pulse-button {
  width: fit-content;
  padding: 0.85rem 1.15rem;
  border: 1px solid rgba(243, 201, 105, 0.45);
  border-radius: 999px;
  background: rgba(243, 201, 105, 0.12);
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.card-stack {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
}

.card {
  padding: 1rem;
  border-radius: 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(14px);
}`,
  'script.js': `const button = document.querySelector('#pulse-button')
const states = [
  'First draft',
  'Second thought',
  'Working version',
  'Ready to ship',
]

let index = 0

button?.addEventListener('click', () => {
  index = (index + 1) % states.length
  button.textContent = states[index]
  console.info('Button state:', states[index])
})

console.log('Deco preview ready')`,
}