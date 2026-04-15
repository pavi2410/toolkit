import { Switch } from '@heroui/react'
import IconMoon from '~icons/tabler/moon'
import IconSun from '~icons/tabler/sun'
import { useTheme } from '../hooks/useTheme'

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme()

  return (
    <Switch
      isSelected={!isDark}
      onChange={() => toggle()}
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
