import { Form } from '@remix-run/react'
import { MoreHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import AdminHeader from '~/themes/default/components/ui/admin/Header'
import { Button } from '~/themes/default/components/ui/button'
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/themes/default/components/ui/tabs'
import { Textarea } from '~/themes/default/components/ui/textarea'
import { PublicPage } from '~/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'

const CustomerList = ({ publicPages }: { publicPages: PublicPage[] }) => {
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
      />

      <div className="max-w-screen-xl w-full flex-1 space-y-4 p-8 pt-6 mx-auto h-auto mt-16">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            {t('system.settings')}
          </h2>
        </div>
        <Tabs defaultValue="store-settings" className="w-full">
          <TabsList>
            <TabsTrigger value="store-settings">
              {t('system.store_settings')}
            </TabsTrigger>
            <TabsTrigger value="account-settings">
              {t('system.account_settings')}
            </TabsTrigger>
            <TabsTrigger value="public-pages">
              {t('system.public_pages')}
            </TabsTrigger>
            <TabsTrigger value="payment">{t('system.payment')}</TabsTrigger>
            <TabsTrigger value="third-party">
              {t('system.thrid-party-services')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="store-settings">
            <Form method="POST" className="space-y-4 w-[480px]">
              <div className="space-y-2">
                <Label htmlFor="store-name">{t('system.name')}</Label>
                <Input type="text" id="store-name" name="store-name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-logo">{t('system.logo')}</Label>
                <Input type="file" id="store-logo" name="store-logo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-description">
                  {t('system.description')}
                </Label>
                <Textarea id="store-description" name="store-description" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-email">{t('system.email')}</Label>
                <Input type="text" id="store-email" name="store-email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-phone">{t('system.phone')}</Label>
                <Input type="text" id="store-phone" name="store-phone" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-currency">
                  {t('system.base_currency')}
                </Label>
                <Input type="text" id="store-currency" name="store-currency" />
              </div>
              <Button>{t('system.save')}</Button>
            </Form>
          </TabsContent>
          <TabsContent value="account-settings">
            Change your password here.
          </TabsContent>
          <TabsContent value="public-pages">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('system.title')}</TableHead>
                  <TableHead>{t('system.url')}</TableHead>
                  <TableHead>{t('system.order')}</TableHead>
                  <TableHead>
                    <span className="sr-only">{t('system.actions')}</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              {publicPages.length ? (
                <TableBody>
                  {publicPages.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>/{item.slug}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {item.order}
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
                  ))}
                </TableBody>
              ) : (
                <div className="text-center">
                  {t('system.no_records_found')}
                </div>
              )}
            </Table>
          </TabsContent>
          <TabsContent value="payment">
            Change your payment settings here.
          </TabsContent>
          <TabsContent value="third-party">
            <Form method="POST" className="space-y-4 w-[480px]">
              <p className="text-xl pt-6">{t('system.openai')}</p>
              <p className="text-sm text-muted-foreground">
                {t('system.openai_hint')}
              </p>
              <div className="space-y-2">
                <Label htmlFor="openai-api-key">
                  {t('system.openai_api_key')}
                </Label>
                <Input type="text" id="openai-api-key" name="openai-api-key" />
              </div>
              <p className="text-xl pt-6">{t('system.cloudflare')}</p>
              <p className="text-sm text-muted-foreground">
                {t('system.cloudflare_hint')}
              </p>
              <div className="space-y-2">
                <Label htmlFor="cloudflare-r2-token">
                  {t('system.cloudflare_r2_token')}
                </Label>
                <Input
                  type="text"
                  id="cloudflare-r2-token"
                  name="cloudflare-r2-token"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cloudflare-access-key-id">
                  {t('system.cloudflare_access_key_id')}
                </Label>
                <Input
                  type="text"
                  id="cloudflare-r2-access-key-id"
                  name="cloudflare-r2-access-key-id"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cloudflare-secret-access-key">
                  {t('system.cloudflare_secret_access_key')}
                </Label>
                <Input
                  type="text"
                  id="cloudflare-secret-access-key"
                  name="cloudflare-secret-access-key"
                />
              </div>
              <Button>{t('system.save')}</Button>
            </Form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default CustomerList
