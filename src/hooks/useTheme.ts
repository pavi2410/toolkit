import { useStore } from '@nanostores/react'
import { persistentAtom } from '@nanostores/persistent'
import { onMount } from 'nanostores'

export type ThemeMode = 'light' | 'dark'

function getSystemMode(): ThemeMode {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(mode: ThemeMode) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(mode)
  root.setAttribute('data-theme', mode)
  root.style.colorScheme = mode
}

export const $theme = persistentAtom<ThemeMode>('theme', getSystemMode())

onMount($theme, () => {
  applyTheme($theme.get())

  return $theme.subscribe((mode) => {
    applyTheme(mode)
  })
})

export function toggleTheme() {
  $theme.set($theme.get() === 'dark' ? 'light' : 'dark')
}

export function useTheme() {
  const mode = useStore($theme)
  return { mode, isDark: mode === 'dark', toggle: toggleTheme }
}

export function useIsDarkTheme() {
  return useStore($theme) === 'dark'
}
