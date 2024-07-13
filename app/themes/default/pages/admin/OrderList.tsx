import AdminHeader from '~/themes/default/components/ui/admin/Header'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '~/themes/default/components/ui/avatar'
import { Button } from '~/themes/default/components/ui/button'
import { Input } from '~/themes/default/components/ui/input'
import { Switch } from '~/themes/default/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/themes/default/components/ui/table'

const OrderList = () => {
  return (
    <div className="mx-6 overflow-hidden">
      <AdminHeader
        navItems={[
          { title: 'Overview', url: '/admin', order: 1 },
          { title: 'Customers', url: '/admin/customers', order: 2 },
          { title: 'Orders', url: '/admin/orders', order: 3 },
          { title: 'Products', url: '/admin/products', order: 4 },
          { title: 'Settings', url: '/admin/settings', order: 5 },
        ]}
      />

      <div className="max-w-screen-xl w-full flex-1 space-y-4 p-8 pt-6 mx-auto h-auto mt-16">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
          <div className="flex items-center space-x-2">
            <Input placeholder="Customer name, email..." />
            <Button>Search</Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="w-[72px]">
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>John Doe</TableCell>
              <TableCell>test@test.com</TableCell>
              <TableCell>
                <Switch />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default OrderList
