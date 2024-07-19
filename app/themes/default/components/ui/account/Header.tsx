import { Link } from '@remix-run/react'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import CustomerContext from '~/contexts/customerContext'
import { Avatar, AvatarFallback } from '~/themes/default/components/ui/avatar'
import { Button } from '~/themes/default/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/themes/default/components/ui/dropdown-menu'

const Header = () => {
  const { t } = useTranslation()
  const { account, storeSettings } = useContext(CustomerContext)
  return (
    <div className="left-0 bg-white border-b fixed w-full flex justify-center z-50">
      <div className="max-w-screen-xl w-full flex h-16 items-center px-4">
        <nav className="flex items-center mx-6 space-x-4 lg:space-x-6">
          <Link to="/account">
            {storeSettings?.logo ? (
              <img
                src={storeSettings.logo}
                alt={storeSettings.name}
                className="object-cover h-18 w-32"
              />
            ) : (
              <h1 className="text-2xl">{storeSettings?.name}</h1>
            )}
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <Link to="/" className="text-sm text-slate-600">
            {t('system.go_storefront')}
          </Link>
          {account && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{`${account.firstName
                      .slice(0, 1)
                      .toUpperCase()}${account.lastName
                      .slice(0, 1)
                      .toUpperCase()}`}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{`${account.firstName} ${account.lastName}`}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {account.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/account/settings">{t('system.settings')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/logout">{t('system.logout')}</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
