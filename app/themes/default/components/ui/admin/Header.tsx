import { Link } from '@remix-run/react'
import { useTranslation } from 'react-i18next'
import { Avatar, AvatarFallback } from '~/themes/default/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/themes/default/components/ui/dropdown-menu'
import { Button } from '~/themes/default/components/ui/button'
import { Input } from '~/themes/default/components/ui/input'
import { PageLink } from '~/types'

const Header = ({ navItems }: { navItems: PageLink[] }) => {
  const { t } = useTranslation()
  return (
    <div className="border-b fixed w-full flex justify-center bg-white z-50">
      <div className="max-w-screen-xl w-full flex h-16 items-center px-4">
        <nav className="flex items-center mx-6 space-x-4 lg:space-x-6">
          {navItems.map(({ title, url }) => {
            return (
              <Link
                key={title}
                to={url}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {title}
              </Link>
            )
          })}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <div>
            <Input
              type="search"
              placeholder="Search..."
              className="md:w-[100px] lg:w-[300px]"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    m@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>{t('system.settings')}</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{t('system.logout')}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

export default Header
