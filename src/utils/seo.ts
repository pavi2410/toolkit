export const SITE_URL = 'https://toolkit.pavi2410.com'
export const SITE_NAME = 'Toolkit'
export const SITE_DESCRIPTION =
  'Free, privacy-friendly browser tools: diff checker, image editor, PDF editor, QR codes, expense splitting and more. Everything runs locally.'
const OG_IMAGE = `${SITE_URL}/og.png`

interface SeoInput {
  title: string
  description: string
  /** route path, e.g. `/qr-code` */
  path: string
}

/** Title, description, canonical and Open Graph / Twitter tags for a page. */
export function seo({ title, description, path }: SeoInput) {
  const url = `${SITE_URL}${path === '/' ? '' : path}`
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:image', content: OG_IMAGE },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: 'Toolkit — free browser tools' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: OG_IMAGE },
    ],
    links: [{ rel: 'canonical', href: url }],
  }
}
