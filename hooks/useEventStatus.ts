import { authState } from '@/hooks/useLogin'
import useSWR from 'swr'
import { QueryKey } from '@/api/QueryKey'
import { api } from '@/api'
import { useSelector } from '@legendapp/state/react'
import dayjs from 'dayjs'

export enum EventStatus {
  Claimable = 'Claimable',
  Claimed = 'Claimed',
  Finished = 'Finished',
}

export function useEventStatus(classID: string, endTime: number) {
  const auth = useSelector(() => authState.get())
  return useSWR<EventStatus>(
    [QueryKey.GetHolderTokens, classID, auth?.address],
    async () => {
      if (
        endTime !== 0 &&
        new Date().getTime() > dayjs.unix(endTime).toDate().getTime()
      ) {
        return EventStatus.Finished
      }
      if (!auth?.address) {
        return EventStatus.Claimable
      }
      const res = await api.getHolderTokens(auth?.address)
      const token = res.data.token_list.find((t) => t.class_uuid === classID)
      if (token) return EventStatus.Claimed
      return EventStatus.Claimable
    }
  )
}
