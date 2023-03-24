import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Space_Grotesk } from 'next/font/google'
import { configureObservablePersistence } from '@legendapp/state/persist'
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage'
import { Toaster } from '@/components/ui/toaster'

const SpaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

configureObservablePersistence({
  persistLocal: ObservablePersistLocalStorage,
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
