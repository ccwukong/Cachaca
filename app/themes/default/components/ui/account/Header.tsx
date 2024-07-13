import { Link } from '@remix-run/react'
import { useTranslation } from 'react-i18next'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '~/themes/default/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/themes/default/components/ui/dropdown-menu'
import { Button } from '~/themes/default/components/ui/button'
import { PageLink } from '~/types'

const Header = ({
  storeLogo,
  storeName,
}: {
  storeLogo: string
  storeName: string
}) => {
  const { t } = useTranslation()
  return (
    <div className="left-0 bg-white border-b fixed w-full flex justify-center z-50">
      <div className="max-w-screen-xl w-full flex h-16 items-center px-4">
        <nav className="flex items-center mx-6 space-x-4 lg:space-x-6">
          {storeLogo ? (
            <img
              src={storeLogo}
              alt={storeName}
              className="object-cover h-18 w-32"
            />
          ) : (
            <h1 className="text-2xl font-bold text-purple-600">{storeName}</h1>
          )}
          <Link
            to="/account"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            {t('system.orders')}
          </Link>
          <Link
            to="/account/settings"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            {t('system.settings')}
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    john.doe@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/logout">Log out</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

export default Header
