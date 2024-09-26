const tlds = [
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

  const websiteVariations = tlds.map((tld) => [
    `https://${query.name}.${tld}`,
    `https://get${query.name}.${tld}`,
    `https://try${query.name}.${tld}`,
    `https://${query.name}app.${tld}`,
    `https://${query.name}ly.${tld}`,
  ])

  return Promise.all(websiteVariations.map(async (websites) =>
    Promise.all(websites.map(async (url) => {
      const available = await fetchDomainAvailability(url)
      return { url, available, priceInCents: 0 }
    }))
  ))
})
