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
  const postAirdrops = useCallback(async () => {
    if (isLoading) return
    setIsLoading(true)
    let address = auth?.address
    if (!address) {
      setIsLoading(true)
      const data = await login()
      if (!data?.address) {
        toast({
          variant: 'destructive',
          title: '⚠️ Error',
          description: 'Unknown error, please try again',
        })
        setIsLoading(false)
        return
      }
      address = data?.address
    }
    try {
      await api.postAirdrops(address, {
        signature: auth?.signature!,
        message: auth?.message!,
        pubkey: auth?.pubkey!,
        challenge: auth?.challenge!,
        keyType: auth?.keyType!,
        alg: auth?.alg!,
      })
    } catch (error) {
      if (error instanceof AxiosError) {
        const code: ErrorCode = error.response?.data?.code
        toast({
          variant: 'destructive',
          title: '⚠️ Error',
          description:
            {
              [ErrorCode.AIRDROPS_DISABLED]: '',
              [ErrorCode.ACCESS_TOKEN_NOT_FOUND]: '',
              [ErrorCode.ACCESS_TOKEN_NOT_MATCH]: '',
              [ErrorCode.ADDRESS_HAS_ALREADY_CLAIMED]: '',
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
    setIsLoading(false)
  }, [auth, isLoading, login, toast])
  return {
    isLoading,
    postAirdrops,
  }
}
