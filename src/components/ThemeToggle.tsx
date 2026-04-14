import { Switch } from '@heroui/react'
import IconMoon from '~icons/tabler/moon'
import IconSun from '~icons/tabler/sun'
import { useEffect, useState } from 'react'

type ThemeMode = 'light' | 'dark'

function getResolvedMode(): ThemeMode {
  if (typeof window === 'undefined') return 'dark'

  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(mode)
  root.setAttribute('data-theme', mode)
  root.style.colorScheme = mode
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const mode = getResolvedMode()
    setIsDark(mode === 'dark')
    applyTheme(mode)
  }, [])

  function toggle(selected: boolean) {
    const mode: ThemeMode = selected ? 'light' : 'dark'
    setIsDark(!selected)
    applyTheme(mode)
    window.localStorage.setItem('theme', mode)
  }

  return (
    <Switch
      isSelected={!isDark}
      onChange={toggle}
      size="lg"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {({ isSelected }) => (
        <Switch.Control>
          <Switch.Thumb>
            <Switch.Icon>
              {isSelected ? (
                <IconSun className="size-3.5 text-inherit" />
              ) : (
                <IconMoon className="size-3.5 text-inherit" />
              )}
            </Switch.Icon>
          </Switch.Thumb>
        </Switch.Control>
      )}
    </Switch>
  )
}
