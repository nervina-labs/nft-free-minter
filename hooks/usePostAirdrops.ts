import { authState } from '@/hooks/useLogin'
import { useCallback, useState } from 'react'
import { api } from '@/api'
import { AxiosError } from 'axios'
import { useToast } from '@/hooks/useToast'
import { ErrorCode } from '@/api/ErrorCode'
import { useSelector } from '@legendapp/state/react'
import {
  AuthResponseData,
  authWithPopup,
  signMessageWithPopup,
} from '@joyid/core'

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
          : await signMessageWithPopup(
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
        if (!auth) {
          authState.set(sig as AuthResponseData)
        }
        await api
          .postAirdrops(
            auth ? auth.address : (sig as AuthResponseData).address,
            sig
          )
          .then(() => 'succeed' as const)
        await callback?.()
        toast({
          title: '🎉 Congratulations! OAT will be delivered soon.',
        })
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
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
              }[code] ||
              error.response?.data?.message ||
              error.message,
          })
        } else {
          toast({
            variant: 'destructive',
            title: '⚠️ Error',
            description: (error as any)?.message || 'Unknown error',
          })
        }
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
