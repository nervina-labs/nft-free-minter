export function isStandaloneBrowser() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone
  )
}
export const isWechat = () =>
  navigator.userAgent.toLowerCase().includes('micromessenger')

export const isImToken = () =>
  navigator.userAgent.toLowerCase().includes('imtoken')

export const isCoinbaseBrowser = () => {
  // @ts-ignore
  const ethereum = window?.ethereum as
    | {
        isCoinbaseWallet?: boolean
        isCoinbaseBrowser?: boolean
      }
    | undefined
  return ethereum?.isCoinbaseBrowser
}

export const isTrust = () => {
  const w = window as any
  return !!w?.ethereum?.isTrust
}

export const isSnapchat = () =>
  navigator.userAgent.toLowerCase().includes('snapchat')

export const isLine = () => navigator.userAgent.toLowerCase().includes('line')

export const isInWebview = () =>
  isStandaloneBrowser() ||
  isWechat() ||
  isImToken() ||
  isCoinbaseBrowser() ||
  isTrust() ||
  isSnapchat() ||
  isLine()
