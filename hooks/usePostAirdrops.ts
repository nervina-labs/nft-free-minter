import { authState } from '@/hooks/useLogin'
import { useCallback, useState } from 'react'
import { api } from '@/api'
import { AxiosError } from 'axios'
import { useToast } from '@/hooks/useToast'
import { ErrorCode } from '@/api/ErrorCode'
import { useSelector } from '@legendapp/state/react'
import { AuthResponseData, authWithPopup, signWithPopup } from '@joyid/core'

export function usePostAirdrops() {
  const auth = useSelector(() => authState.get())
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const postAirdrops = useCallback(
    async (callback?: () => void) => {
      if (isLoading) return
      setIsLoading(true)
      try {
        const sig = !auth
          ? await authWithPopup({
              redirectURL: location.origin + '/',
              name: 'Freeminter',
              challenge: `Claim a OAT\nNonce: ${Math.floor(
                Math.random() * 100001
              )}`,
              logo: location.origin + '/logo.svg',
            })
          : await signWithPopup(
              {
                redirectURL: location.origin + '/',
                name: 'Freeminter',
                challenge: `Claim a OAT\nNonce: ${Math.floor(
                  Math.random() * 100001
                )}`,
                logo: location.origin + '/logo.svg',
                address: auth.address,
              },
              {
                timeoutInSeconds: 86400,
              }
            )
        if (sig.error) {
          if (!['Popup closed', 'User Rejected'].includes(sig.error)) {
            toast({
              variant: 'destructive',
              title: '⚠️ Error',
              description: sig.error,
            })
          } else if (sig.error === 'User Rejected') {
            toast({
              title: '⚠️ Cancel',
              description: sig.error,
            })
          }
          setIsLoading(false)
          return
        }
        if (!auth) {
          authState.set(sig.data as AuthResponseData)
        }
        await api
          .postAirdrops(
            auth ? auth.address : (sig.data as AuthResponseData).address,
            sig.data!
          )
          .then(() => 'succeed' as const)
        await callback?.()
        toast({
          title: '🎉 Congratulations! OAT will be delivered soon.',
        })
        setIsLoading(false)
      } catch (error) {
        if (error instanceof AxiosError) {
          const code: ErrorCode = error.response?.data?.code
          if (code === ErrorCode.ADDRESS_HAS_ALREADY_CLAIMED) {
            await callback?.()
            return
          }
          toast({
            variant: 'destructive',
            title: '⚠️ Error',
            description:
              {
                [ErrorCode.AIRDROPS_DISABLED]: 'The airdrops is disabled',
                [ErrorCode.ACCESS_TOKEN_NOT_FOUND]: '',
                [ErrorCode.ACCESS_TOKEN_NOT_MATCH]: '',
                [ErrorCode.ADDRESS_HAS_ALREADY_CLAIMED]:
                  'You have already claimed it',
                [ErrorCode.INVALID_CREDENTIAL]:
                  'Invalid device, please check the JoyID wallet',
                [ErrorCode.UNKNOWN_ERROR]: '',
                [ErrorCode.INVALID_SIGNATURE]:
                  'Invalid signature, please try again',
              }[code] || 'Unknown error',
          })
        } else {
          toast({
            variant: 'destructive',
            title: '⚠️ Error',
            description: (error as any)?.message || 'Unknown error',
          })
        }
        setIsLoading(false)
        throw error
      }
    },
    [auth, isLoading, toast]
  )
  return {
    isLoading,
    postAirdrops,
  }
}
