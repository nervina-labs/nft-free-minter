import { observable } from '@legendapp/state'
import { AuthResponse, authWithPopup } from '@joyid/core'
import { persistObservable } from '@legendapp/state/persist'
import { useCallback } from 'react'
import { useToast } from '@/hooks/useToast'

export const authState = observable<NonNullable<AuthResponse['data']> | null>(
  null
)

persistObservable(authState, {
  local: {
    name: 'auth1.0',
  },
})

export function useLogin() {
  const { toast } = useToast()
  return useCallback(
    async (nonce: number = Math.floor(Math.random() * 10)) => {
      const res = await authWithPopup(
        {
          redirectURL: location.origin + '/',
          name: 'FreeMinter',
          logo: location.origin + '/logo.svg',
        },
        {
          timeoutInSeconds: 86400,
        }
      )
      if (res.error == null) {
        authState.set(res.data)
        return res.data
      } else {
        if (!['Popup closed', 'User Rejected'].includes(res.error)) {
          toast({
            variant: 'destructive',
            title: '⚠️ Error',
            description: res.error,
          })
        } else if (res.error === 'User Rejected') {
          toast({
            title: '⚠️ Cancel',
            description: res.error,
          })
        }
      }
    },
    [toast]
  )
}

export function useLogout() {
  return useCallback(() => {
    authState.set(null)
  }, [])
}
