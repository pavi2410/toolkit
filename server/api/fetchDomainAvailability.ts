export default defineEventHandler(async (event) => {
  const { name, domain } = getQuery(event)

  try {
    const res = await fetch(`https://${name}.${domain}`)
    return {
      available: !res.ok,
      priceInCents: 0, // Since we don't have price information, set it to 0
    }
  } catch (error) {
    // If fetch fails, it means the domain is likely available
    return {
      available: false,
      priceInCents: 0,
    }
  }
})
