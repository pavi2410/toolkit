const domains = [
  'com', 'net', 'org', 'io', 'dev', 'app', 'in',
  'tech', 'co', 'ai', 'xyz', 'me', 'ing',
] as const

async function fetchDomainAvailability(url: string) {
  try {
    const res = await fetch(url)
    return !res.ok;
  } catch (error) {
    // If fetch fails, it means the domain is likely available
    return false;
  }
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  return Promise.all(domains.map(async (domain) => {
    const url = `https://${query.name}.${domain}`
    const available = await fetchDomainAvailability(url)
    return { domain, available, priceInCents: 0, url }
  }))
})
