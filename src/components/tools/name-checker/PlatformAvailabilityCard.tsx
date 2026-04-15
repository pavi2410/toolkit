import { Button, Chip, Skeleton, Surface } from '@heroui/react'
import { PLATFORMS, PLATFORM_DISPLAY_NAMES, type Platform, type PlatformResult } from './types'
import IconCheck from '~icons/tabler/circle-check'
import IconX from '~icons/tabler/circle-x'
import IconQuestion from '~icons/tabler/circle-dashed'
import IconWarning from '~icons/tabler/alert-triangle'

import IconGithub from '~icons/devicon/github'
import IconPython from '~icons/devicon/python'
import IconHomebrew from '~icons/devicon/homebrew'
import IconRust from '~icons/devicon/rust'
import IconNpm from '~icons/devicon/npm-wordmark'
import IconRuby from '~icons/devicon/ruby'
import IconNuget from '~icons/devicon/nuget'
import IconComposer from '~icons/devicon/composer'
import IconGo from '~icons/devicon/go'

interface Props {
  platformResults: Map<string, PlatformResult>
  isLoading: boolean
  onRetry: () => void
}

const PlatformIconMap: Record<Platform, React.ComponentType<{ className?: string }>> = {
  'GitHub repo': IconGithub,
  'GitHub org/user': IconGithub,
  'PyPI package': IconPython,
  'Homebrew cask/formula': IconHomebrew,
  'Rust crate': IconRust,
  'npm package': IconNpm,
  'npm org': IconNpm,
  'Ruby gem': IconRuby,
  'Nuget package': IconNuget,
  'Packagist package': IconComposer,
  'Go package': IconGo,
}

export default function PlatformAvailabilityCard({ platformResults, isLoading, onRetry }: Props) {
  const hasResults = platformResults.size > 0
  const hasError = Array.from(platformResults.values()).some((result) => result.status === 'error')
  const availableCount = Array.from(platformResults.values()).filter(
    (result) => result.status !== 'error' && result.available
  ).length

  const getPlatformResult = (platform: Platform) => platformResults.get(platform)

  const getStatusIcon = (platform: Platform) => {
    const result = getPlatformResult(platform)
    if (!result) return <IconQuestion className="text-xs text-muted" />
    if (result.status === 'error') return <IconWarning className="text-xs text-yellow-600 dark:text-yellow-500" />
    return result.available
      ? <IconCheck className="text-xs text-green-600 dark:text-green-500" />
      : <IconX className="text-xs text-red-600 dark:text-red-500" />
  }

  const getStatusChip = (platform: Platform) => {
    const result = getPlatformResult(platform)
    if (!result) {
      return (
        <Chip color="default" size="sm" variant="soft">
          <Chip.Label>Pending</Chip.Label>
        </Chip>
      )
    }

    if (result.status === 'error') {
      return (
        <Chip color="warning" size="sm" variant="soft">
          <Chip.Label>Error</Chip.Label>
        </Chip>
      )
    }

    return result.available ? (
      <Chip color="success" size="sm" variant="soft">
        <Chip.Label>Available</Chip.Label>
      </Chip>
    ) : (
      <Chip color="danger" size="sm" variant="soft">
        <Chip.Label>Taken</Chip.Label>
      </Chip>
    )
  }

  const renderPlatformCard = (platform: Platform) => {
    const result = getPlatformResult(platform)
    const PlatformIcon = PlatformIconMap[platform]
    const isLoadingPlatform = isLoading && !result

    if (isLoadingPlatform) {
      return (
        <Surface key={platform} className="flex items-center gap-2.5 rounded-2xl p-3 shadow-none">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-secondary">
            <PlatformIcon className="text-xl" />
          </div>

          <div className="min-w-0 flex-1 space-y-1.5">
            <p className="truncate text-sm font-medium leading-5 text-foreground">
              {PLATFORM_DISPLAY_NAMES[platform]}
            </p>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </Surface>
      )
    }

    return (
      <a
        key={platform}
        href={result?.link || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="block no-underline"
      >
        <Surface variant={result?.available ? 'secondary' : 'default'} className="flex items-center gap-2.5 rounded-2xl p-3 shadow-none transition-transform duration-200 hover:-translate-y-0.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-secondary">
              <PlatformIcon className="text-xl" />
            </div>

            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex items-center gap-1.5">
                {getStatusIcon(platform)}
                <p className="truncate text-sm font-medium leading-5 text-foreground">
                  {PLATFORM_DISPLAY_NAMES[platform]}
                </p>
              </div>
              <div className="w-fit">
                {getStatusChip(platform)}
              </div>
            </div>
        </Surface>
      </a>
    )
  }

  return (
    <Surface className="space-y-4 rounded-3xl p-5 shadow-none">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">Platform Availability</h3>
          <p className="text-sm text-muted">Open a result to verify the exact package or namespace.</p>
        </div>
        <Chip color="success" variant="soft" size="sm">
          <Chip.Label>{availableCount} Available</Chip.Label>
        </Chip>
      </div>
      <div>
        {hasResults || isLoading ? (
          <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
            {PLATFORMS.map((platform) => renderPlatformCard(platform))}
          </div>
        ) : hasError && !isLoading ? (
          <div className="text-center py-8">
            <IconWarning className="text-yellow-500 text-2xl mx-auto mb-2" />
            <p className="text-sm text-muted">Failed to check platform availability</p>
            <Button variant="ghost" onPress={onRetry} className="mt-2 text-sm">
              Retry
            </Button>
          </div>
        ) : (
          <div className="text-center py-8 text-muted">
            <p className="text-sm">Enter a name to check platform availability</p>
          </div>
        )}
      </div>
    </Surface>
  )
}
