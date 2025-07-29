const tlds = [
  'com', 'net', 'org', 'io', 'dev', 'app', 'in',
  'tech', 'co', 'ai', 'xyz', 'me', 'ing',
] as const

const variations = ['-', 'get-', 'try-', '-app', '-ly'] as const

// RDAP bootstrap mapping for TLDs
const rdapBootstrap: Record<string, string> = {
  'com': 'https://rdap.verisign.com/com/v1',
  'net': 'https://rdap.verisign.com/net/v1', 
  'org': 'https://rdap.publicinterestregistry.org/rdap',
  'io': 'https://rdap.nic.io',
  'dev': 'https://pubapi.registry.google/rdap',
  'app': 'https://pubapi.registry.google/rdap',
  'in': 'https://rdap.nixiregistry.in/rdap',
  'tech': 'https://rdap.centralnic.com/tech',
  'co': 'https://rdap.nic.co',
  'ai': 'https://rdap.identitydigital.services/rdap',
  'xyz': 'https://rdap.centralnic.com/xyz',
  'me': 'https://rdap.nic.me',
  'ing': 'https://pubapi.registry.google/rdap',
}

function extractTld(domain: string): string {
  return domain.split('.').pop() || ''
}

async function checkDomainAvailability(domain: string) {
  const tld = extractTld(domain)
  const rdapBase = rdapBootstrap[tld]
  
  if (!rdapBase) {
    throw new Error(`RDAP server not configured for TLD: ${tld}`)
  }

  try {
    const resp = await fetch(`${rdapBase}/domain/${domain}`)
    
    if (resp.status === 404) {
      return { available: true }
    }
    
    if (!resp.ok) {
      throw new Error(`RDAP request failed with status: ${resp.status}`)
    }

    const data = await resp.json()
    const expEvent = data.events?.find((e: any) => e.eventAction === 'expiration')
    
    return {
      available: false,
      expires: expEvent?.eventDate
    }
  } catch (error) {
    throw new Error(`RDAP lookup failed: ${error}`)
  }
}

function buildDomainUrl(name: string, variation: string, tld: string): string {
  const actualVariation = variation.replace('-', name)
  return `https://${actualVariation}.${tld}`
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  
  if (!query.name || !query.variation || !query.tld) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing name, variation, or tld parameter'
    })
  }

  const name = query.name as string
  const variation = query.variation as string
  const tld = query.tld as string

  if (!tlds.includes(tld as any)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid TLD'
    })
  }

  if (!variations.includes(variation as any)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid variation'
    })
  }

  try {
    const url = buildDomainUrl(name, variation, tld)
    const domain = `${name}${variation === '-' ? '' : variation.replace('-', '')}.${tld}`
    const result = await checkDomainAvailability(domain)
    
    return { 
      url,
      variation,
      tld,
      available: result.available, 
      expires: result.expires,
      priceInCents: 0,
      status: 'success' as const
    }
  } catch (error) {
    const url = buildDomainUrl(name, variation, tld)
    return {
      url,
      variation, 
      tld,
      available: false,
      expires: undefined,
      priceInCents: 0,
      status: 'error' as const,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})