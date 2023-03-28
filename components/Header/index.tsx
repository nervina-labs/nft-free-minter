import LogoIconSVG from '@/assets/logo.svg'
import WalletIconSVG from '@/assets/wallet.svg'
import ArrowDownIconSVG from '@/assets/arrow-down.svg'
import CardCoinIconSVG from '@/assets/card-coin.svg'
import LogoutIconSVG from '@/assets/logout.svg'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { observer } from '@legendapp/state/react-components'
import { authState, useLogin, useLogout } from '@/hooks/useLogin'
import { truncateMiddle } from '@/lib/utils'
import { JOYID_APP_URL } from '@/constants'

export const Header = observer(() => {
  const login = useLogin()
  const logout = useLogout()
  const auth = authState.get()

  return (
    <header className="w-full h-[68px] fixed top-0 left-0 bg-white flex justify-center drop-shadow-md z-30">
      <div className="w-[1120px] h-full flex justify-between items-center px-[25px] sm:px-[80px]">
        <div className="flex font-bold text-[24px] leading-[32px] h-[36px] leading-[36px]">
          <LogoIconSVG className="w-[32px] h-[32px] mr-[6px]" />
          Freeminter
        </div>
        {auth != null ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline">
                <WalletIconSVG className="mr-[4px]" />
                <ArrowDownIconSVG />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={14}>
              <DropdownMenuItem
                onClick={() => {
                  window.open(JOYID_APP_URL)
                }}
              >
                <CardCoinIconSVG className="mr-[8px]" />
                {truncateMiddle(auth.address)}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>
                <LogoutIconSVG className="mr-[8px]" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="connect" onClick={() => login()}>
            Connect
          </Button>
        )}
      </div>
    </header>
  )
})
