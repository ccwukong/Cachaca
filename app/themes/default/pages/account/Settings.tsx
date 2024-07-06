import { useState } from 'react'
import { Link } from '@remix-run/react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/themes/default/components/ui/card'
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
import { Input } from '~/themes/default/components/ui/input'

const Settings = ({
  storeLogo,
  storeName,
}: {
  storeLogo: string
  storeName: string
}) => {
  return (
    <div className="mx-6 overflow-hidden">
      <div className="flex flex-col">
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
                <h1 className="text-2xl font-bold text-purple-600">
                  {storeName}
                </h1>
              )}
              <Link
                to="/account"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Orders
              </Link>
              <Link
                to="/account/settings"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Settings
              </Link>
            </nav>
            <div className="ml-auto flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        John Doe
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        john.doe@example.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className="max-w-screen-xl md:max-w-screen-md w-full flex-1 space-y-4 md:p-8 mx-auto h-auto mt-24">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-normal">Name</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="flex gap-8">
                <Input placeholder="First Name" />
                <Input placeholder="Last Name" />
              </form>
            </CardContent>
            <CardFooter className="px-6 py-4 flex justify-end">
              <Button>Save</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-normal">
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <Input placeholder="New password" type="password" />
              </form>
            </CardContent>
            <CardFooter className="px-6 py-4 flex justify-end">
              <Button>Save</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-normal">Email</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-4">
                <Input placeholder="Email" />
              </form>
            </CardContent>
            <CardFooter className="px-6 py-4 flex justify-end">
              <Button>Save</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Settings
