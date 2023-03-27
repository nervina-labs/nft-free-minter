import { authState } from '@/hooks/useLogin'
import useSWR from 'swr'
import { QueryKey } from '@/api/QueryKey'
import { api } from '@/api'
import { EVENT_END_TIME, EVENT_TOKEN_UUID } from '@/constants'
import { useSelector } from '@legendapp/state/react'

export enum EventStatus {
  Claimable = 'Claimable',
  Claimed = 'Claimed',
  Finished = 'Finished',
}

export function useEventStatus() {
  const auth = useSelector(() => authState.get())
  return useSWR<EventStatus>(
    [QueryKey.GetHolderTokens, auth?.address],
    async () => {
      if (
        EVENT_END_TIME != null &&
        new Date().getTime() > new Date(EVENT_END_TIME).getTime()
      ) {
        return EventStatus.Finished
      }
      if (!auth?.address) {
        return EventStatus.Claimable
      }
      const res = await api.getHolderTokens(auth?.address)
      const token = res.data.token_list.find(
        (t) => t.class_uuid === EVENT_TOKEN_UUID
      )
      if (token) return EventStatus.Claimed
      return EventStatus.Claimable
    }
  )
}
