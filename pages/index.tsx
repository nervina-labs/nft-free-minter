import Head from 'next/head'
import { Header } from '@/components/Header'
import { Button, ButtonProps } from '@/components/ui/button'
import { observer } from '@legendapp/state/react-components'
import { EventStatus, useEventStatus } from '@/hooks/useEventStatus'
import { Loader2 } from 'lucide-react'
import { usePostAirdrops } from '@/hooks/usePostAirdrops'
import NFTImage from '@/assets/NFT_image.png'
import Image from 'next/image'
import { EVENT_END_TIME, JOYID_APP_URL } from '@/constants'
import { useMemo } from 'react'
import useSWR from 'swr'
import { api } from '@/api'
import { QueryKey } from '@/api/QueryKey'
import { authState, useLogin } from '@/hooks/useLogin'

const ClaimButton = observer<{ onClaim?: () => void }>(({ onClaim }) => {
  const {
    data: eventStatus = EventStatus.Claimable,
    isLoading,
    mutate,
  } = useEventStatus()
  const { postAirdrops, isLoading: isPostingAirdrops } = usePostAirdrops()
  const auth = authState.get()
  const login = useLogin()
  const refetch = async () => {
    await onClaim?.()
    await mutate()
  }
  return (
    <Button
      variant={
        (
          {
            [EventStatus.Claimable]: 'claim',
            [EventStatus.Claimed]: 'view_wallet',
            [EventStatus.Finished]: 'finished',
          } as unknown as { [key in EventStatus]: ButtonProps['variant'] }
        )[eventStatus]
      }
      className="mt-[12px]"
      disabled={
        isLoading || eventStatus === EventStatus.Finished || isPostingAirdrops
      }
      onClick={async () => {
        if (isLoading || eventStatus === EventStatus.Finished) return
        if (eventStatus === EventStatus.Claimed) {
          window.open(JOYID_APP_URL)
        }
        if (eventStatus === EventStatus.Claimable) {
          if (!auth) {
            await login()
            await refetch()
            return
          }
          await postAirdrops(() => refetch()).catch(async () => refetch())
        }
      }}
    >
      {isLoading || isPostingAirdrops ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : null}
      {
        {
          [EventStatus.Claimable]: 'Claim',
          [EventStatus.Claimed]: 'View wallet',
          [EventStatus.Finished]: 'Finished',
        }[eventStatus]
      }
    </Button>
  )
})

export default function Home() {
  const endTime = useMemo(() => {
    if (!EVENT_END_TIME) return null
    const date = new Date(EVENT_END_TIME)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ⏳${
      hours <= 9 ? '0' + hours : hours
    }:${minutes <= 9 ? '0' + hours : hours} GMT +08:00🕗`
  }, [])
  const { data: claimCount, mutate: refetchClaimCount } = useSWR(
    [QueryKey.GetClaimCount],
    async () => api.getClaimCount().then((res) => res.data.claimed_count)
  )

  return (
    <>
      <Head>
        <title>Freeminter</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <div className="bg-[#fafafa] min-h-screen flex flex-col justify-start items-center pb-[48px]">
        <Header />
        <main className="w-full mt-[68px] h-full xs:h-auto xs:max-w-[480px] xs:mt-[100px] bg-white pt-[48px] pb-[32px] px-[32px] xs:rounded-[32px] xs:drop-shadow-md flex flex-col">
          <h1 className="text-[16px] text-[#FC6621] leading-[20px] font-bold text-center">
            Web3 Festival Attendency Proof 🎫
          </h1>
          <p className="text-xs text-[#333] leading-[20px] text-center font-medium mt-[8px]">
            👉📅End time: {endTime}
          </p>
          <div className="bg-[#f7f6f0] rounded-[24px] mt-[16px] overflow-hidden">
            <div className="w-full h-[220px] py-[30px] flex justify-center relative overflow-hidden select-none pointer-events-none">
              <Image
                className="w-auto h-full relative z-10"
                src={NFTImage.src}
                width={NFTImage.width}
                height={NFTImage.height}
                alt="NFT"
              />
              <Image
                className="w-[200%] h-[200%] absolute blur-3xl transform-gpu opacity-50 translate-y-[-30%]"
                src={NFTImage.src}
                width={NFTImage.width}
                height={NFTImage.height}
                alt="NFT_background"
              />
            </div>
            <div className="pt-[8px] p-[16px] text-[#333]">
              <h3 className="font-medium text-[16px] leading-[20px]">
                Ethereum Merge Stamps
              </h3>
              <div className="flex justify-between font-normal text-xs leading-[14px] mt-[8px]">
                <div>Joyid wallet</div>
                <div>Unlimited</div>
              </div>
            </div>
          </div>
          <p className="font-normal text-xs leading-4 text-center mt-[32px]">
            The inaugural Web3 Festival，co-hosted by Wangxiang Blockchain Labs
            and HashKey Group and organized by W3ME, will take place on April
            12-15 at 5/F,Hong Kong Conventionand Exhibition Center(HKCEC).This
            four-day event, hosted on five center stages across an area of
            about9,000m2,will see over 10,000 attendees.
          </p>
          <p className="font-bold text-xs leading-4 text-center text-[#3D45FB] w-full mt-[32px] mx-auto">
            Claimed: {claimCount || '-'}
          </p>
          <ClaimButton onClaim={refetchClaimCount} />
        </main>
      </div>
    </>
  )
}
