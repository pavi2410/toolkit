import { Card, Badge, Button, Spinner } from '@heroui/react'
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

  const getPlatformResult = (platform: Platform) => platformResults.get(platform)

  const getBadgeColor = (platform: Platform): 'default' | 'success' | 'danger' | 'warning' => {
    const result = getPlatformResult(platform)
    if (!result) return 'default'
    if (result.status === 'error') return 'warning'
    return result.available ? 'success' : 'danger'
  }

  const getPlatformCardClass = (platform: Platform) => {
    const result = getPlatformResult(platform)
    if (!result) return 'border-border'

    if (result.status === 'error') {
      return 'border-yellow-300 bg-yellow-50 hover:bg-yellow-100 dark:border-yellow-600 dark:bg-yellow-950 dark:hover:bg-yellow-900'
    }

    return result.available
      ? 'border-green-300 bg-green-50 hover:bg-green-100 dark:border-green-600 dark:bg-green-950 dark:hover:bg-green-900'
      : 'border-red-300 bg-red-50 hover:bg-red-100 dark:border-red-600 dark:bg-red-950 dark:hover:bg-red-900'
  }

  const getStatusIcon = (platform: Platform) => {
    const result = getPlatformResult(platform)
    if (!result) return <IconQuestion className="text-xs text-muted" />
    if (result.status === 'error') return <IconWarning className="text-xs text-yellow-600 dark:text-yellow-500" />
    return result.available
      ? <IconCheck className="text-xs text-green-600 dark:text-green-500" />
      : <IconX className="text-xs text-red-600 dark:text-red-500" />
  }

  const renderPlatformCard = (platform: Platform) => {
    const result = getPlatformResult(platform)
    const PlatformIcon = PlatformIconMap[platform]
    const isLoadingPlatform = isLoading && !result

    return (
      <Badge.Anchor key={platform}>
        <a
          href={result?.link || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-20 h-20 flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all duration-200 hover:scale-105 cursor-pointer ${getPlatformCardClass(platform)}`}
        >
          {isLoadingPlatform ? (
            <Spinner size="md" className="mb-1" />
          ) : (
            <PlatformIcon className="text-2xl mb-1" />
          )}
          <span className="text-xs text-center font-medium text-foreground leading-tight">
            {PLATFORM_DISPLAY_NAMES[platform]}
          </span>
        </a>
        <Badge color={getBadgeColor(platform)} placement="top-right" className="p-0.5">
          {getStatusIcon(platform)}
        </Badge>
      </Badge.Anchor>
    )
  }

  return (
    <Card.Root variant="default">
      <Card.Header>
        <Card.Title>Platform Availability</Card.Title>
      </Card.Header>
      <Card.Content>
        {hasResults || isLoading ? (
          <div className="flex flex-wrap gap-3">
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
      </Card.Content>
    </Card.Root>
  )
}
