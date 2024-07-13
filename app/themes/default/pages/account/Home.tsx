import { useTranslation } from 'react-i18next'
import Header from '~/themes/default/components/ui/account/Header'
import { Badge } from '~/themes/default/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/themes/default/components/ui/table'
import { OrderItem } from '~/types'

const Account = ({ orders }: { orders: OrderItem[] }) => {
  const { t } = useTranslation()
  return (
    <div className="mx-6 overflow-hidden lg:mx-0">
      <Header storeLogo="" storeName="Cachaca" pageLinks={[]} />
      <div className="flex flex-col">
        <div className="max-w-screen-xl w-full flex-1 md:space-y-4 md:p-8 pt-6 mx-auto h-auto mt-16">
          <p className="text-2xl font-light">{t('system.orders')}</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead className="hidden sm:table-cell">
                  {t('system.shipping_status')}
                </TableHead>
                <TableHead className="hidden sm:table-cell">
                  {t('system.payment_status')}
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  {t('system.date')}
                </TableHead>
                <TableHead className="text-right">
                  {t('system.amount')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((item) => {
                return (
                  <TableRow key={item.id}>
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
                      {item.createdOn}
                    </TableCell>
                    <TableCell className="text-right">$250.00</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default Account
