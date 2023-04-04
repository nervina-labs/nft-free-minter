import ArrowSVG from '@/assets/webview-guide/arrow.svg'
import CloudSVG from '@/assets/webview-guide/cloud.svg'
import PhonePngPath from '@/assets/webview-guide/phone.png'
import { useEffect, useMemo } from 'react'
import Image from 'next/image'

export const WebviewGuide: React.FC = () => {
  const clouds = useMemo(
    () => [
      { className: 'w-[35.2%] top-[130px] left-[-17.6%]' },
      { className: 'w-[49.87%] top-[177px] right-[-25.07%]' },
      { className: 'w-[72%] bottom-[-60px] left-[-6.13%] z-[2]' },
      { className: 'w-[81.6%] left-[-1.6%] bottom-[-147px] z-[3]' },
      { className: 'w-[81.6%] left-[39.2%] bottom-[-60px] z-[4]' },
    ],
    []
  )
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      // @ts-ignore
      document.body.style.overflow = null
    }
  }, [])

  return (
    <div
      className="w-full h-full min-h-screen relative overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, #E9F4FF 0%, rgba(233, 244, 255, 0) 100%)',
      }}
    >
      <div className="mx-auto relative w-full h-full min-h-screen max-w-[500px] flex flex-col">
        {clouds.map((cloud, i) => (
          <CloudSVG key={i} className={`${cloud.className} absolute h-auto`} />
        ))}
        <div className="flex flex-col w-[70%] m-auto left-[15%] max-h-[calc(100% - 40px)] text-center font-bold text-[18px] leading-[23px] my-auto py-[20px]">
          <h1 className="mb-[74px] z-[3] text-[#3D45FB] whitespace-pre-line">
            Please open this page
            <br />
            in browser
          </h1>
          <Image
            src={PhonePngPath.src}
            alt="phone"
            width={PhonePngPath.width}
            height={PhonePngPath.height}
          />
        </div>
        <ArrowSVG className="w-[42%] h-auto absolute top-0 right-[-20px] z-[2]" />
      </div>
    </div>
  )
}
