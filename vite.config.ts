import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import Icons from 'unplugin-icons/vite'

const devtoolsSsrStub = fileURLToPath(new URL('./src/integrations/devtools/ssr.ts', import.meta.url))
const devtoolsPkgs = [
  '@tanstack/react-devtools',
  '@tanstack/react-router-devtools',
  '@tanstack/react-query-devtools',
]

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  environments: {
    ssr: {
      resolve: {
        alias: Object.fromEntries(devtoolsPkgs.map((pkg) => [pkg, devtoolsSsrStub])),
      },
      optimizeDeps: {
        exclude: [...devtoolsPkgs, '@tanstack/devtools-ui', 'solid-js', 'solid-js/web'],
      },
    },
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    devtools(),
    tailwindcss(),
    Icons({
      compiler: 'jsx',
      jsx: 'react',
    }),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
