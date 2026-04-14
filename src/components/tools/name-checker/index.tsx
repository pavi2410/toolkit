import { useEffect, useRef, useState, useCallback } from 'react'
import { NuqsAdapter } from 'nuqs/adapters/react'
import { parseAsString, useQueryState } from 'nuqs'
import { SearchField, Alert } from '@heroui/react'
import { PLATFORMS, TLDS, NAME_VARIATIONS, type PlatformResult, type DomainResult } from './types'
import PlatformAvailabilityCard from './PlatformAvailabilityCard'
import DomainAvailabilityMatrix from './DomainAvailabilityMatrix'
import IconSearch from '~icons/tabler/search'

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

    if (searchName.trim()) {
      debounceTimer.current = setTimeout(() => {
        doSearch()
      }, 500)
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [searchName])

  useEffect(() => {
    return () => {
      if (currentAbortController.current) {
        currentAbortController.current.abort()
      }
    }
  }, [])

  return (
    <div className="flex flex-col h-full px-6 py-3 gap-6">
      {/* Search Section */}
      <div className="text-center">
        <p className="text-muted mb-3">
          Find out if your project name is taken across platforms and domains
        </p>

        <div className="max-w-md mx-auto flex flex-col gap-3">
          <SearchField
            value={searchName}
            onChange={(val) => setSearchName(val.trim())}
            onSubmit={() => doSearch()}
            fullWidth
            variant="secondary"
            aria-label="Project name"
          >
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="Enter project name..." />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>

          {error && (
            <Alert status="danger">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Description>{error}</Alert.Description>
              </Alert.Content>
            </Alert>
          )}
        </div>
      </div>

      {/* Results Section */}
      {searchName.trim() ? (
        <div className="space-y-6 flex-1 overflow-auto">
          <DomainAvailabilityMatrix
            domainResults={domainResults}
            isLoading={isLoading}
            searchName={searchName}
            onRetry={doSearch}
          />

          <PlatformAvailabilityCard
            platformResults={platformResults}
            isLoading={isLoading}
            onRetry={doSearch}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <IconSearch className="text-4xl text-muted mx-auto mb-4" />
            <p className="text-muted">Enter a name above to check availability</p>
          </div>
        </div>
      )}
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
