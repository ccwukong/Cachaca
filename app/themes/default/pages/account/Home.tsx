import { useState } from 'react'
import { Link } from '@remix-run/react'
import { Badge } from '~/themes/default/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/themes/default/components/ui/table'
import {
  Card,
  CardContent,
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

const Account = ({
  storeLogo,
  storeName,
  orders,
}: {
  storeLogo: string
  storeName: string
  orders: object[] //TODO: create OrderItem model
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
        <div className="max-w-screen-xl w-full flex-1 md:space-y-4 md:p-8 pt-6 mx-auto h-auto mt-16">
          <Card x-chunk="dashboard-05-chunk-3">
            <CardHeader className="px-7">
              <CardTitle>Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Shipping Status
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Payment Status
                    </TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((item) => {
                    return (
                      <TableRow key={item.id} className="bg-accent">
                        <TableCell>{item.id}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge className="text-xs" variant="secondary">
                            {item.shippingStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge className="text-xs" variant="secondary">
                            {item.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          2023-06-23
                        </TableCell>
                        <TableCell className="text-right">$250.00</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Account
