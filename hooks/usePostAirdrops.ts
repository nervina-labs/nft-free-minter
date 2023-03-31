import { authState } from '@/hooks/useLogin'
import { useCallback, useState } from 'react'
import { api } from '@/api'
import { AxiosError } from 'axios'
import { useToast } from '@/hooks/useToast'
import { ErrorCode } from '@/api/ErrorCode'
import { useSelector } from '@legendapp/state/react'
import { signWithPopup } from '@joyid/core'

export function usePostAirdrops() {
  const auth = useSelector(() => authState.get())
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const postAirdrops = useCallback(
    async (callback?: () => void) => {
      if (isLoading) return
      setIsLoading(true)
      try {
        if (!auth) {
          setIsLoading(false)
          return
        }
        const sig = await signWithPopup({
          redirectURL: location.origin + '/',
          name: 'Freeminter',
          challenge: 'Claim a OAT',
          logo: location.origin + '/logo.svg',
          address: auth.address,
        })
        if (sig.error) {
          toast({
            variant: 'destructive',
            title: '⚠️ Error',
            description: sig.error,
          })
          setIsLoading(false)
          return
        }
        await api
          .postAirdrops(auth.address, sig.data!)
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
