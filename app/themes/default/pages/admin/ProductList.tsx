import { useTranslation } from 'react-i18next'
import AdminHeader from '~/themes/default/components/ui/admin/Header'
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
import { PageLink, ProductPublicInfo, StoreSettings } from '~/types'

const ProductList = ({
  navLinks,
  products,
  storeSettings,
}: {
  navLinks: PageLink[]
  products: ProductPublicInfo[]
  storeSettings: StoreSettings
}) => {
  const { t } = useTranslation()
  return (
    <div className="mx-6 overflow-hidden">
      <AdminHeader navItems={navLinks} />

      <div className="max-w-screen-xl w-full flex-1 space-y-4 p-8 pt-6 mx-auto h-auto mt-16">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            {t('system.products')}
          </h2>
          <div className="flex items-center space-x-2">
            <Input placeholder="" />
            <Button>{t('system.search')}</Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>{t('system.name')}</TableHead>
              <TableHead>{t('system.base_price')}</TableHead>
              <TableHead>{t('system.status')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((item) => {
              return (
                <TableRow key={item.id}>
                  <TableCell className="w-[72px]">
                    <img src={item.coverImage} alt={item.name} />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{`${storeSettings.currency.symbol}${item.basePrice}`}</TableCell>
                  <TableCell>
                    <Switch />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ProductList
