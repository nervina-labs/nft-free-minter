export const NFTBOX_SERVER_URL =
  process.env.NEXT_NFTBOX_SERVER_URL ||
  'https://goldenlegend.staging.nftbox.me/api/external/v1'
export const NFTBOX_ACCESS_TOKEN = process.env.NEXT_NFTBOX_ACCESS_TOKEN
export const EVENT_TOKEN_UUID =
  process.env.NEXT_PUBLIC_EVENT_TOKEN_UUID ||
  'e1b5d17d-0a0a-403a-a979-08fef0bdfaf0'
export const EVENT_END_TIME = process.env.NEXT_PUBLIC_EVENT_END_TIME || null

export const JOYID_APP_URL =
  process.env.NEXT_PUBLIC_JOYID_APP_URL || 'https://app.joyid.dev'

export const JOYID_APP_NFT_URL = JOYID_APP_URL + '?asset=Collectible'

export const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'free.nftbox.me'
