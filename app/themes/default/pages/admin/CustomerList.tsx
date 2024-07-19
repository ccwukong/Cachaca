import { MoreHorizontal } from 'lucide-react'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import AdminHeader from '~/themes/default/components/ui/admin/Header'
import { Button } from '~/themes/default/components/ui/button'
import { CardFooter } from '~/themes/default/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '~/themes/default/components/ui/dropdown-menu'
import { Input } from '~/themes/default/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/themes/default/components/ui/table'
import { UserPublicInfo } from '~/types'

const CustomerList = ({
  customers,
  account,
}: {
  customers: UserPublicInfo[]
  account: UserPublicInfo
}) => {
  const { t } = useTranslation()
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
        account={account}
      />

      <div className="max-w-screen-xl w-full flex-1 space-y-4 p-8 pt-6 mx-auto h-auto mt-16">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            {t('system.customers')}
          </h2>
          <div className="flex items-center space-x-2">
            <Input placeholder="Customer name, email..." />
            <Button>Search</Button>
          </div>
        </div>
        {customers ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Registered On</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((item) => {
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{`${item.firstName} ${item.lastName}`}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>
                        {moment.unix(item.createdOn).format('DD MMM, YYYY')}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                              {t('system.actions')}
                            </DropdownMenuLabel>
                            <DropdownMenuItem>
                              {t('system.edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {t('system.disable')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-10</strong> of <strong>32</strong> records
              </div>
            </CardFooter>
          </>
        ) : (
          <div className="text-center">{t('system.no_records_found')}</div>
        )}
      </div>
    </div>
  )
}

export default CustomerList
