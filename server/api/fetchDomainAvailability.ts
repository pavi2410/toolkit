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

  const websiteVariations = domains.map((domain) => [
    `https://${query.name}.${domain}`,
    `https://get${query.name}.${domain}`,
    `https://try${query.name}.${domain}`,
    `https://${query.name}app.${domain}`,
    `https://${query.name}ly.${domain}`,
  ])

  return Promise.all(websiteVariations.map(async (websites) =>
    Promise.all(websites.map(async (url) => {
      const available = await fetchDomainAvailability(url)
      return { url, available, priceInCents: 0 }
    }))
  ))
})
