import { Card, Button, Spinner, Table } from '@heroui/react'
import { TLDS, NAME_VARIATIONS, type DomainResult, type NameVariation, type TLD } from './types'
import IconCheck from '~icons/tabler/circle-check'
import IconX from '~icons/tabler/circle-x'
import IconQuestion from '~icons/tabler/circle-dashed'
import IconWarning from '~icons/tabler/alert-triangle'

interface Props {
  domainResults: Map<string, DomainResult>
  isLoading: boolean
  searchName: string
  onRetry: () => void
}

export default function DomainAvailabilityMatrix({ domainResults, isLoading, searchName, onRetry }: Props) {
  const hasResults = domainResults.size > 0
  const hasError = Array.from(domainResults.values()).some((result) => result.status === 'error')

  const getDomainResult = (variation: NameVariation, tld: TLD) =>
    domainResults.get(`${variation}-${tld}`)

  const getDomainUrl = (variation: NameVariation, tld: TLD) => {
    if (!searchName) return `https://${variation}.${tld}`
    return `https://${variation.replace('-', searchName)}.${tld}`
  }

  const getTooltipText = (variation: NameVariation, tld: TLD) => {
    const result = getDomainResult(variation, tld)
    if (!result) return getDomainUrl(variation, tld)
    if (result.status === 'error') return result.error || 'Error checking domain'
    if (!result.available && result.expires) {
      const localExpiry = new Date(result.expires).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
      return `Expires: ${localExpiry}`
    }
    return result.available ? 'Available' : 'Not available'
  }

  const getCellContent = (variation: NameVariation, tld: TLD) => {
    const result = getDomainResult(variation, tld)
    const isLoadingCell = isLoading && !result

    if (isLoadingCell) return <Spinner size="sm" />
    if (!result) return <IconQuestion className="text-lg text-muted" />
    if (result.status === 'error') return <IconWarning className="text-lg text-yellow-500 dark:text-yellow-400" />
    return result.available
      ? <IconCheck className="text-lg text-green-500 dark:text-green-400" />
      : <IconX className="text-lg text-red-500 dark:text-red-400" />
  }

  return (
    <Card.Root variant="default">
      <Card.Header>
        <Card.Title>Domain Availability</Card.Title>
      </Card.Header>
      <Card.Content className="p-0">
        {hasError && !isLoading && !hasResults ? (
          <div className="text-center py-8 px-4">
            <IconWarning className="text-yellow-500 text-2xl mx-auto mb-2" />
            <p className="text-sm text-muted">Failed to check domain availability</p>
            <Button variant="ghost" onPress={onRetry} className="mt-2 text-sm">
              Retry
            </Button>
          </div>
        ) : !hasResults && !isLoading && !hasError ? (
          <div className="text-center py-8 px-4 text-muted">
            <p className="text-sm">Enter a name above to check domain availability</p>
          </div>
        ) : (
          <Table>
            <Table.ScrollContainer className="overflow-x-auto">
              <Table.Content>
                <Table.Header>
                  <Table.Column className="text-left">Name</Table.Column>
                  {TLDS.map((tld) => (
                    <Table.Column key={tld} className="text-center">.{tld}</Table.Column>
                  ))}
                </Table.Header>
                <Table.Body>
                  {NAME_VARIATIONS.map((variation) => (
                    <Table.Row key={variation}>
                      <Table.Cell>
                        <span className="font-mono text-muted text-sm">{variation}</span>
                      </Table.Cell>
                      {TLDS.map((tld) => (
                        <Table.Cell key={`${variation}-${tld}`} className="text-center">
                          <a
                            href={getDomainUrl(variation, tld)}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={getTooltipText(variation, tld)}
                            className="inline-flex items-center justify-center p-1 rounded hover:bg-default transition-colors"
                          >
                            {getCellContent(variation, tld)}
                          </a>
                        </Table.Cell>
                      ))}
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        )}
      </Card.Content>
    </Card.Root>
  )
}
