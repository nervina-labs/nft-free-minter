import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Space_Grotesk } from 'next/font/google'
import { configureObservablePersistence } from '@legendapp/state/persist'
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage'
import { Toaster } from '@/components/ui/toaster'
import { initConfig } from '@joyid/core'
import { JOYID_APP_URL } from '@/constants'

const SpaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

configureObservablePersistence({
  persistLocal: ObservablePersistLocalStorage,
})

initConfig({
  joyidAppURL: JOYID_APP_URL,
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${SpaceGrotesk.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
      <Toaster />
    </>
  )
}
