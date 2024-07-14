import { Form } from '@remix-run/react'
import { useTranslation } from 'react-i18next'
import AdminHeader from '~/themes/default/components/ui/admin/Header'
import { Input } from '~/themes/default/components/ui/input'
import { Label } from '~/themes/default/components/ui/label'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/themes/default/components/ui/tabs'
import { Textarea } from '~/themes/default/components/ui/textarea'

const CustomerList = () => {
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
            </Form>
          </TabsContent>
          <TabsContent value="account-settings">
            Change your password here.
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default CustomerList
