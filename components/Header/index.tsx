import LogoIconSVG from '@/assets/logo.svg'
import { Button } from '@/components/ui/button'

export const Header: React.FC = () => {
  return (
    <header className="w-full h-[68px] bg-white flex justify-center drop-shadow-md">
      <div className="w-[1120px] h-full flex justify-between items-center px-[80px]">
        <div className="flex font-bold text-[24px] leading-[32px] h-[36px] leading-[36px]">
          <LogoIconSVG className="w-[32px] h-[32px] mr-[6px]" />
          Freeminter
        </div>
        <Button variant="connect">Connect</Button>
      </div>
    </header>
  )
}
