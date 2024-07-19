import { Form } from '@remix-run/react'
import { MoreHorizontal, WandSparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import AdminHeader from '~/themes/default/components/ui/admin/Header'
import { Button } from '~/themes/default/components/ui/button'
import { CardFooter } from '~/themes/default/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/themes/default/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '~/themes/default/components/ui/dropdown-menu'
import { Input } from '~/themes/default/components/ui/input'
import { Label } from '~/themes/default/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/themes/default/components/ui/table'
import { Textarea } from '~/themes/default/components/ui/textarea'
import {
  PageLink,
  ProductPublicInfo,
  StoreSettings,
  UserPublicInfo,
} from '~/types'

const ProductList = ({
  navLinks,
  products,
  storeSettings,
  account,
}: {
  navLinks: PageLink[]
  products: ProductPublicInfo[]
  storeSettings: StoreSettings
  account: UserPublicInfo
}) => {
  const { t } = useTranslation()
  return (
    <div className="mx-6 overflow-hidden">
      <AdminHeader navItems={navLinks} account={account} />

      <div className="max-w-screen-xl w-full flex-1 space-y-4 p-8 pt-6 mx-auto h-auto mt-16">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            {t('system.products')}
          </h2>

          <div className="flex items-center space-x-2">
            <Input placeholder="" />
            <Button>{t('system.search')}</Button>
            <Dialog>
              <DialogTrigger>
                <Button className="bg-green-600 hover:bg-green-600">
                  {t('system.add')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-screen-md">
                <DialogHeader>
                  <DialogTitle>{t('system.add_product')}</DialogTitle>
                </DialogHeader>
                <Form method="POST" className="space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="text-right">{t('system.name')}</div>
                    <Input
                      id="name"
                      name="name"
                      className="col-span-3"
                      required
                      value=""
                      onChange={(e) => {}}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="text-right">{t('system.slug')}</div>
                    <Input
                      id="slug"
                      name="slug"
                      className="col-span-3"
                      required
                      value=""
                      onChange={(e) => {}}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">
                      {t('system.description')}
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      className="col-span-3"
                      required
                      value=""
                      onChange={(e) => {}}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">{t('system.category')}</Label>
                    <select name="category" id="category">
                      <option value="1">Men</option>
                      <option value="2">Women</option>
                      <option value="3">Accessories</option>
                    </select>
                  </div>
                </Form>
                <DialogFooter>
                  <Button type="submit">{t('system.save')}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="secondary">
              <WandSparkles size={16} color="#f5c20a" /> {t('system.try_ai')}
            </Button>
          </div>
        </div>
        {products ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>{t('system.name')}</TableHead>
                  <TableHead>{t('system.base_price')}</TableHead>
                  <TableHead></TableHead>
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

export default ProductList
