import type { ContentKind, QrContent } from './types'

function escapeWifi(value: string) {
  return value.replace(/([\\;,:])/g, '\\$1')
}

function withHttps(url: string) {
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

export function buildPayload(content: QrContent): string {
  switch (content.kind) {
    case 'text':
      return content.text.trim()
    case 'url':
      return withHttps(content.url)
    case 'wifi': {
      const { ssid, password, security, hidden } = content.wifi
      if (!ssid.trim()) return ''
      const auth = security === 'nopass' ? 'nopass' : security
      const pass = auth === 'nopass' ? '' : `P:${escapeWifi(password)};`
      return `WIFI:T:${auth};S:${escapeWifi(ssid.trim())};${pass}H:${hidden};;`
    }
    case 'email': {
      const { to, subject, body } = content.email
      if (!to.trim()) return ''
      const params = new URLSearchParams()
      if (subject.trim()) params.set('subject', subject.trim())
      if (body.trim()) params.set('body', body.trim())
      const query = params.toString()
      return `mailto:${to.trim()}${query ? `?${query}` : ''}`
    }
    case 'phone': {
      const phone = content.phone.trim()
      return phone ? `tel:${phone}` : ''
    }
  }
}

export function exampleContent(kind: ContentKind): Partial<QrContent> {
  switch (kind) {
    case 'text':
      return { text: 'Hello from Toolkit' }
    case 'url':
      return { url: typeof window !== 'undefined' ? window.location.origin : 'https://example.com' }
    case 'wifi':
      return { wifi: { ssid: 'Guest', password: 'toolkit', security: 'WPA', hidden: false } }
    case 'email':
      return { email: { to: 'hello@example.com', subject: 'Hello', body: 'Sent from Toolkit' } }
    case 'phone':
      return { phone: '+15555550100' }
  }
}
