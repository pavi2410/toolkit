import { useEffect, useRef, useState, useCallback } from 'react'
import { NuqsAdapter } from 'nuqs/adapters/react'
import { parseAsString, useQueryState } from 'nuqs'
import { Alert, Button, Chip, SearchField, Surface } from '@heroui/react'
import { PLATFORMS, TLDS, NAME_VARIATIONS, type PlatformResult, type DomainResult } from './types'
import PlatformAvailabilityCard from './PlatformAvailabilityCard'
import DomainAvailabilityMatrix from './DomainAvailabilityMatrix'
import IconSearch from '~icons/tabler/search'

const SUGGESTED_NAMES = ['orbit', 'canvaslab', 'dockyard', 'framekit']

function NameCheckerContent() {
  const [searchName, setSearchName] = useQueryState(
    'name',
    parseAsString.withDefault('').withOptions({ shallow: false })
  )

  const [platformResults, setPlatformResults] = useState<Map<string, PlatformResult>>(new Map())
  const [domainResults, setDomainResults] = useState<Map<string, DomainResult>>(new Map())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const currentAbortController = useRef<AbortController | null>(null)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const trimmedSearchName = searchName.trim()

  const checkPlatforms = useCallback(async (name: string, signal: AbortSignal) => {
    const promises = PLATFORMS.map(async (platform) => {
      try {
        const response = await fetch(`/api/check-platform?name=${encodeURIComponent(name)}&platform=${encodeURIComponent(platform)}`, {
          signal,
        })
        const result = (await response.json()) as PlatformResult

        if (!signal.aborted) {
          setPlatformResults((prev) => new Map(prev).set(platform, result))
        }
      } catch (err: any) {
        if (err.name === 'AbortError' || signal.aborted) return

        setPlatformResults((prev) =>
          new Map(prev).set(platform, {
            platform,
            available: false,
            link: '#',
            status: 'error',
          })
        )
      }
    })

    return Promise.allSettled(promises)
  }, [])

  const checkDomains = useCallback(async (name: string, signal: AbortSignal) => {
    const promises: Promise<void>[] = []

    for (const tld of TLDS) {
      for (const variation of NAME_VARIATIONS) {
        const key = `${variation}-${tld}`
        promises.push(
          (async () => {
            try {
              const response = await fetch(
                `/api/check-domain?name=${encodeURIComponent(name)}&variation=${encodeURIComponent(variation)}&tld=${encodeURIComponent(tld)}`,
                { signal }
              )
              const result = (await response.json()) as DomainResult

              if (!signal.aborted) {
                setDomainResults((prev) => new Map(prev).set(key, result))
              }
            } catch (err: any) {
              if (err.name === 'AbortError' || signal.aborted) return

              const actualVariation = variation.replace('-', name)
              setDomainResults((prev) =>
                new Map(prev).set(key, {
                  url: `https://${actualVariation}.${tld}`,
                  variation,
                  tld,
                  available: false,
                  priceInCents: 0,
                  status: 'error',
                })
              )
            }
          })()
        )
      }
    }

    return Promise.allSettled(promises)
  }, [])

  const doSearch = useCallback(async () => {
    const name = searchName.trim()
    if (!name) {
      setError('Please enter a name')
      return
    }

    if (currentAbortController.current) {
      currentAbortController.current.abort()
    }

    currentAbortController.current = new AbortController()
    const signal = currentAbortController.current.signal

    setError('')
    setIsLoading(true)
    setPlatformResults(new Map())
    setDomainResults(new Map())

    try {
      await Promise.all([checkPlatforms(name, signal), checkDomains(name, signal)])
    } catch (err: any) {
      if (err.name !== 'AbortError' && !signal.aborted) {
        setError('Search failed. Please try again.')
      }
    } finally {
      if (!signal.aborted) {
        setIsLoading(false)
      }
    }
  }, [searchName, checkPlatforms, checkDomains])

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    if (trimmedSearchName) {
      debounceTimer.current = setTimeout(() => {
        const signalController = new AbortController()
        const signal = signalController.signal

        if (currentAbortController.current) {
          currentAbortController.current.abort()
        }

        currentAbortController.current = signalController
        setError('')
        setIsLoading(true)
        setPlatformResults(new Map())
        setDomainResults(new Map())

        Promise.all([checkPlatforms(trimmedSearchName, signal), checkDomains(trimmedSearchName, signal)])
          .catch((err: any) => {
            if (err.name !== 'AbortError' && !signal.aborted) {
              setError('Search failed. Please try again.')
            }
          })
          .finally(() => {
            if (!signal.aborted) {
              setIsLoading(false)
            }
          })
      }, 500)
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [trimmedSearchName, checkPlatforms, checkDomains])

  useEffect(() => {
    return () => {
      if (currentAbortController.current) {
        currentAbortController.current.abort()
      }
    }
  }, [])

  const availablePlatforms = Array.from(platformResults.values()).filter(
    (result) => result.status !== 'error' && result.available
  ).length
  const availableDomains = Array.from(domainResults.values()).filter(
    (result) => result.status !== 'error' && result.available
  ).length

  return (
    <div className="flex h-full min-h-0 min-w-0 w-full flex-col gap-4 bg-surface-secondary p-4 lg:p-5">
      <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div className="flex min-h-0 flex-col gap-4">
          <Surface className="space-y-4 rounded-3xl p-5 shadow-none">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">Search a Name</h2>
              <p className="text-sm text-muted">
                Check the same candidate across registries, social surfaces, and domain variations.
              </p>
            </div>
            <div className="space-y-4">
              <SearchField
                value={searchName}
                onChange={(val) => setSearchName(val)}
                onSubmit={() => doSearch()}
                fullWidth
                variant="secondary"
                aria-label="Project name"
              >
                <SearchField.Group>
                  <SearchField.SearchIcon />
                  <SearchField.Input placeholder="Enter a project name…" />
                  <SearchField.ClearButton />
                </SearchField.Group>
              </SearchField>

              <div className="flex flex-wrap gap-2">
                {SUGGESTED_NAMES.map((name) => (
                  <Button
                    key={name}
                    variant="secondary"
                    size="sm"
                    onPress={() => setSearchName(name)}
                  >
                    {name}
                  </Button>
                ))}
              </div>

              {error && (
                <Alert status="danger">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Description>{error}</Alert.Description>
                  </Alert.Content>
                </Alert>
              )}

              <div className="flex flex-wrap gap-2">
                <Chip color="default" variant="soft" size="sm">
                  <Chip.Label>{PLATFORMS.length} Platforms</Chip.Label>
                </Chip>
                <Chip color="default" variant="soft" size="sm">
                  <Chip.Label>{TLDS.length * NAME_VARIATIONS.length} Domain Checks</Chip.Label>
                </Chip>
                <Chip color={isLoading ? 'accent' : 'success'} variant="soft" size="sm">
                  <Chip.Label>{isLoading ? 'Checking…' : 'Ready'}</Chip.Label>
                </Chip>
              </div>
            </div>
          </Surface>

          <Surface variant="secondary" className="space-y-3 rounded-3xl p-5 shadow-none">
            <p className="text-sm font-semibold text-foreground">What this view optimizes for</p>
            <ul className="space-y-2 text-sm leading-6 text-muted">
              <li>One search fans out across package ecosystems, GitHub surfaces, and domain patterns.</li>
              <li>Availability data stays visible in a dense matrix instead of forcing repeated searches.</li>
              <li>External links open directly from the result surface so follow-up validation is immediate.</li>
            </ul>
          </Surface>
        </div>

        <div className="flex min-h-0 flex-col gap-4 overflow-hidden">
          {trimmedSearchName ? (
            <>
              <Surface variant="secondary" className="flex flex-col gap-3 rounded-3xl p-5 shadow-none lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">Results for “{trimmedSearchName}”</p>
                  <p className="text-sm text-muted">
                    Scan for greenfield options first, then open the links that need manual confirmation.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Chip color="success" variant="soft" size="sm">
                    <Chip.Label>{availablePlatforms} Platforms Available</Chip.Label>
                  </Chip>
                  <Chip color="accent" variant="soft" size="sm">
                    <Chip.Label>{availableDomains} Domains Available</Chip.Label>
                  </Chip>
                </div>
              </Surface>

              <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto pr-1">
                <DomainAvailabilityMatrix
                  domainResults={domainResults}
                  isLoading={isLoading}
                  searchName={trimmedSearchName}
                  onRetry={doSearch}
                />

                <PlatformAvailabilityCard
                  platformResults={platformResults}
                  isLoading={isLoading}
                  onRetry={doSearch}
                />
              </div>
            </>
          ) : (
            <Surface className="flex flex-1 items-center justify-center rounded-3xl p-8 text-center shadow-none">
              <div className="space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-default text-muted">
                  <IconSearch className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-foreground">Start with a candidate name</p>
                  <p className="mx-auto max-w-lg text-sm leading-6 text-muted">
                    You’ll get a dense domain matrix plus platform-by-platform availability without leaving this workspace.
                  </p>
                </div>
              </div>
            </Surface>
          )}
        </div>
      </div>
    </div>
  )
}

export default function NameChecker() {
  return (
    <NuqsAdapter>
      <NameCheckerContent />
    </NuqsAdapter>
  )
}
