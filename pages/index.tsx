import Head from 'next/head'
import { Header } from '@/components/Header'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'

export default function Home() {
  const { data = {} } = useSWR(`GetNFTInfo`, () => {
    return {
      src: '/images/NFT_image.png',
      description:
        'The inaugural Web3 Festival，co-hosted by Wangxiang Blockchain Labs and HashKey Group and organized by W3ME, will take place on April 12-15 at 5/F,Hong Kong Conventionand Exhibition Center(HKCEC).This four-day event, hosted on five center stages across an area of about9,000m2,will see over 10,000 attendees.',
      claimed: 204,
    }
  })

  return (
    <>
      <Head>
        <title>Freeminter</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-[#fafafa] h-screen flex flex-col justify-start items-center">
        <Header />
        <main className="w-full max-w-[480px] mt-[32px] bg-white pt-[48px] pb-[32px] px-[32px] rounded-[32px] drop-shadow-md flex flex-col">
          <h1 className="text-[16px] text-[#FC6621] leading-[20px] font-bold text-center">
            Web3 Festival Attendency Proof 🎫
          </h1>
          <p className="text-xs text-[#333] leading-[20px] text-center font-medium mt-[8px]">
            👉📅End time: 2022/10/01 ⏳08:00 GMT +08:00🕗
          </p>
          <div className="bg-[#f7f6f0] rounded-[24px] mt-[16px] overflow-hidden">
            <div className="w-full h-[220px] py-[30px] flex justify-center relative overflow-hidden">
              <img
                className="w-auto h-full relative z-10"
                src={data.src}
                alt="NFT"
              />
              <img
                className="w-[200%] h-[200%] absolute blur-3xl transform-gpu opacity-50 translate-y-[-30%]"
                src={data.src}
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
            {data.description}
          </p>
          <p className="font-bold text-xs leading-4 text-center text-[#3D45FB] w-full mt-[32px] mx-auto">
            Claimed: {data.claimed}
          </p>
          <Button
            variant="claim"
            className="bg-[#D2FF00] border-[#000] border-[1px] rounded-[16px] py-[15px] text-base font-bold leading-4 mt-[12px]"
          >
            Claim
          </Button>
        </main>
      </div>
    </>
  )
}
