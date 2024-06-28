import { Link } from '@remix-run/react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '~/themes/default/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '~/themes/default/components/ui/dropdown-menu'
import { Button } from '~/themes/default/components/ui/button'
import { Input } from '~/themes/default/components/ui/input'

export interface NavItem {
  title: string
  link: string
}

const Header = ({ navItems }: { navItems: NavItem[] }) => {
  return (
    <div className="border-b fixed w-full flex justify-center bg-white z-50">
      <div className="max-w-screen-xl w-full flex h-16 items-center px-4">
        <nav className="flex items-center mx-6 space-x-4 lg:space-x-6">
          {navItems.map(({ title, link }) => {
            return (
              <Link
                to={link}
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
                  <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">shadcn</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    m@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  Profile
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Billing
                  <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Settings
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Log out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

export default Header
