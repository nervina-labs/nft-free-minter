import { observable } from '@legendapp/state'
import { AuthResponse, authWithPopup } from '@joyid/core'
import { persistObservable } from '@legendapp/state/persist'
import { useCallback } from 'react'

export const authState = observable<NonNullable<AuthResponse['data']> | null>(
  null
)

persistObservable(authState, {
  local: {
    name: 'auth',
  },
})

export function useLogin() {
  return useCallback(async (nonce: number = Math.floor(Math.random() * 10)) => {
    const res = await authWithPopup({
      redirectURL: location.origin + '/',
      name: 'FreeMinter',
      challenge: `nonce: ${nonce}`,
      logo: location.origin + '/logo.svg',
    })
    if (res.error == null) {
      authState.set(res.data)
    }
  }, [])
}

export function useLogout() {
  return useCallback(() => {
    authState.set(null)
  }, [])
}
