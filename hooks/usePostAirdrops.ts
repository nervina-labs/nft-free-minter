import { authState, useLogin } from '@/hooks/useLogin'
import { useCallback, useState } from 'react'
import { api } from '@/api'
import { AxiosError } from 'axios'
import { useToast } from '@/hooks/useToast'
import { ErrorCode } from '@/api/ErrorCode'
import { useSelector } from '@legendapp/state/react'

export function usePostAirdrops() {
  const auth = useSelector(() => authState.get())
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const login = useLogin()
  const postAirdrops = useCallback(
    async (callback?: () => void) => {
      if (isLoading) return
      setIsLoading(true)
      try {
        const a = auth ? auth : await login()
        if (!a) {
          setIsLoading(false)
          return
        }
        await api.postAirdrops(a.address, {
          signature: a.signature!,
          message: a.message!,
          pubkey: a.pubkey,
          challenge: a.challenge!,
          keyType: a.keyType,
          alg: a.alg,
        })
        await callback?.()
        toast({
          title: '✅ Succeed',
          description: 'Successful Claim NFT!',
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
                [ErrorCode.ADDRESS_HAS_ALREADY_CLAIMED]: '',
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
    [auth, isLoading, login, toast]
  )
  return {
    isLoading,
    postAirdrops,
  }
}
