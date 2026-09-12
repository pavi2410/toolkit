export const CONTENT_KINDS = ['url', 'text', 'wifi', 'email', 'phone'] as const
export type ContentKind = (typeof CONTENT_KINDS)[number]

export const ECC_LEVELS = ['L', 'M', 'Q', 'H'] as const
export type EccLevel = (typeof ECC_LEVELS)[number]

export const WIFI_SECURITY = ['WPA', 'WEP', 'nopass'] as const
export type WifiSecurity = (typeof WIFI_SECURITY)[number]

export interface WifiForm {
  ssid: string
  password: string
  security: WifiSecurity
  hidden: boolean
}

export interface EmailForm {
  to: string
  subject: string
  body: string
}

export interface QrContent {
  kind: ContentKind
  text: string
  url: string
  wifi: WifiForm
  email: EmailForm
  phone: string
}

export interface QrStyle {
  ecc: EccLevel
  border: number
  size: number
  fg: string
  bg: string
}

export const DEFAULT_CONTENT: QrContent = {
  kind: 'url',
  text: '',
  url: '',
  wifi: { ssid: '', password: '', security: 'WPA', hidden: false },
  email: { to: '', subject: '', body: '' },
  phone: '',
}

export const DEFAULT_STYLE: QrStyle = {
  ecc: 'M',
  border: 4,
  size: 512,
  fg: '#000000',
  bg: '#ffffff',
}
