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
    name: 'auth1.1',
  },
})

export function useLogin() {
  const { toast } = useToast()
  return useCallback(
    async (nonce: number = Math.floor(Math.random() * 10)) => {
      try {
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
        authState.set(res)
        return res
      } catch (error) {
        const errMsg = (error as Error).message
        if (!['Popup closed', 'User Rejected'].includes(errMsg)) {
          toast({
            variant: 'destructive',
            title: '⚠️ Error',
            description: errMsg,
          })
        } else if (errMsg === 'User Rejected') {
          toast({
            title: '⚠️ Cancel',
            description: errMsg,
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
