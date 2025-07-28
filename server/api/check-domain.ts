const tlds = [
  'com', 'net', 'org', 'io', 'dev', 'app', 'in',
  'tech', 'co', 'ai', 'xyz', 'me', 'ing',
] as const

const variations = ['-', 'get-', 'try-', '-app', '-ly'] as const

async function fetchDomainAvailability(url: string) {
  try {
    const res = await fetch(url)
    return !res.ok;
  } catch (error) {
    // If fetch fails, it means the domain is likely available
    return false;
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
    const available = await fetchDomainAvailability(url)
    
    return { 
      url,
      variation,
      tld,
      available, 
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
      priceInCents: 0,
      status: 'error' as const
    }
  }
})