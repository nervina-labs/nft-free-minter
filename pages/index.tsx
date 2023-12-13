/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import PlausibleProvider from 'next-plausible'
import { Header } from '@/components/Header'
import { Button, ButtonProps } from '@/components/ui/button'
import { observer } from '@legendapp/state/react-components'
import { EventStatus, useEventStatus } from '@/hooks/useEventStatus'
import { Loader2 } from 'lucide-react'
import { usePostAirdrops } from '@/hooks/usePostAirdrops'
import { DOMAIN, JOYID_APP_NFT_URL, NFTBOX_SERVER_URL } from '@/constants'
import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { api } from '@/api'
import { QueryKey } from '@/api/QueryKey'
import { isInWebview } from '@/lib/browser-env'
import { WebviewGuide } from '@/components/WebviewGuide'
import { authState } from '@/hooks/useLogin'
import dayjs from 'dayjs'
import type { GetServerSideProps } from 'next'

interface NftInfo {
  bg_image_url: string
  class_name: string
  description: string
  total: string | number
  ended_at: number
  class_uuid: string
}

export const getServerSideProps: GetServerSideProps<{
  nftInfo: NftInfo
}> = async ({ res }) => {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )
  const data = await fetch(`${NFTBOX_SERVER_URL}/airdrop_events`)
  const nftInfo = await data.json()
  return { props: { nftInfo } }
}

function isSupportedFileName(str: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'webp']
  const pattern = new RegExp(`(${imageExtensions.join('|')})$`, 'i')
  return pattern.test(str)
}

const getNftThumbnail = (image: string) => {
  if (!isSupportedFileName(image)) {
    return image
  }
  try {
    const imgUrl = new URL(image)
    if ('images.nftbox.me' === imgUrl.host) {
      const pathname = imgUrl.pathname.split('/')
      pathname.splice(2, 0, '200x200')
      imgUrl.pathname = pathname.join('/')
      return imgUrl.toString()
    }
    return imgUrl.toString()
  } catch (error) {
    return image
  }
}

const ClaimButton = observer<{ onClaim?: () => void; nftInfo: NftInfo }>(
  ({ onClaim, nftInfo }) => {
    const {
      data: eventStatus = EventStatus.Claimable,
      isLoading,
      mutate,
    } = useEventStatus(nftInfo.class_uuid, nftInfo.ended_at)
    const { postAirdrops, isLoading: isPostingAirdrops } = usePostAirdrops()
    const auth = authState.get()
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
            window.open(`${JOYID_APP_NFT_URL}&select_address=${auth?.address}`)
          }
          if (eventStatus === EventStatus.Claimable) {
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
  }
)

const Main = observer(({ nftInfo }: { nftInfo: NftInfo }) => {
  const endTime = useMemo(() => {
    if (nftInfo.ended_at === 0) return null
    const date = dayjs.unix(nftInfo.ended_at).toDate()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ⏳${
      hours <= 9 ? '0' + hours : hours
    }:${minutes <= 9 ? '0' + hours : hours} GMT +08:00🕗`
  }, [nftInfo])
  const { data: claimCount, mutate: refetchClaimCount } = useSWR(
    [QueryKey.GetClaimCount],
    async () => api.getClaimCount().then((res) => res.data.claimed_count),
    {
      refreshInterval: 5000,
    }
  )
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div
      className="bg-[#fafafa] min-h-screen flex flex-col justify-start items-center"
      style={{ opacity: isMounted ? undefined : 0 }}
    >
      {isMounted ? <Header /> : null}
      <main className="w-full mt-[68px] h-full xs:h-auto xs:max-w-[480px] xs:mt-[100px] bg-white pt-[48px] pb-[32px] px-[32px] xs:rounded-[32px] xs:drop-shadow-md flex flex-col pb-[48px]">
        <h1 className="text-[16px] text-[#FC6621] leading-[20px] font-bold text-center">
          {nftInfo.class_name}
        </h1>
        {endTime ? (
          <p className="text-xs text-[#333] leading-[20px] text-center font-medium mt-[8px]">
            👉📅End time: {endTime}
          </p>
        ) : null}
        <div className="bg-[#F5F5F5] rounded-[24px] mt-[16px] overflow-hidden">
          <div className="w-full h-[220px] py-[30px] flex justify-center relative overflow-hidden select-none pointer-events-none">
            <img
              className="w-auto h-full relative z-10"
              src={getNftThumbnail(nftInfo.bg_image_url)}
              alt="NFT"
            />
            <img
              className="w-[200%] h-[200%] absolute blur-[25px] transform-gpu opacity-50 translate-y-[-30%]"
              src={getNftThumbnail(nftInfo.bg_image_url)}
              alt="NFT_background"
            />
          </div>
          <div className="pt-[8px] p-[16px] text-[#333]">
            <h3 className="font-medium text-[16px] leading-[20px]">
              {nftInfo.class_name}
            </h3>
            <div className="flex justify-between font-normal text-xs leading-[14px] mt-[8px]">
              <div>
                {nftInfo.total === '0'
                  ? 'Unlimited'
                  : `Limited ${nftInfo.total}`}
              </div>
            </div>
          </div>
        </div>
        <p className="font-normal text-xs leading-4 text-center mt-[32px]">
          {nftInfo.description}
        </p>
        <p className="font-bold text-xs leading-4 text-center text-[#3D45FB] w-full mt-[32px] mx-auto">
          Claimed:{' '}
          {claimCount == null || claimCount == undefined ? '-' : claimCount}
        </p>
        {isMounted ? (
          <ClaimButton onClaim={refetchClaimCount} nftInfo={nftInfo} />
        ) : null}
      </main>
    </div>
  )
})

export default function Home(props: { nftInfo: NftInfo }) {
  const [isCurrentInWebview, setIsCurrentIsWebview] = useState(false)
  useEffect(() => {
    setIsCurrentIsWebview(isInWebview())
  }, [])
  return (
    <>
      <Head>
        <title>Freeminter NFT</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <PlausibleProvider domain={DOMAIN} enabled>
        {isCurrentInWebview ? (
          <WebviewGuide />
        ) : (
          <Main nftInfo={props.nftInfo} />
        )}
      </PlausibleProvider>
    </>
  )
}
