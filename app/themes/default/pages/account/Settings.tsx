import { Form } from '@remix-run/react'
import { useTranslation } from 'react-i18next'
import Header from '~/themes/default/components/ui/account/Header'
import { Button } from '~/themes/default/components/ui/button'
import { Checkbox } from '~/themes/default/components/ui/checkbox'
import { Input } from '~/themes/default/components/ui/input'
import { Label } from '~/themes/default/components/ui/label'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/themes/default/components/ui/tabs'
import { StoreSettings, UserPublicInfo } from '~/types'

const Settings = ({
  account,
  storeSettings,
}: {
  account: UserPublicInfo
  storeSettings: StoreSettings
}) => {
  const { t } = useTranslation()
  return (
    <div className="mx-6 overflow-hidden">
      <Header
        storeLogo={storeSettings.logo}
        storeName={storeSettings.name}
        account={account}
      />
      <div className="max-w-screen-xl w-full flex-1 space-y-4 p-8 pt-6 mx-auto h-auto mt-16">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            {t('system.settings')}
          </h2>
        </div>
        <Tabs defaultValue="account-settings" className="w-full">
          <TabsList>
            <TabsTrigger value="account-settings">
              {t('system.account_settings')}
            </TabsTrigger>
            <TabsTrigger value="addresses">
              {t('system.my_addresses')}
            </TabsTrigger>
            <TabsTrigger value="change-password">
              {t('system.change_password')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account-settings">
            <Form method="POST" className="space-y-4 w-[480px]">
              <div className="space-y-2">
                <Label htmlFor="first-name">{t('system.firstname')}</Label>
                <Input
                  type="text"
                  id="first-name"
                  name="first-name"
                  value={account.firstName}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-email">{t('system.lastname')}</Label>
                <Input
                  type="text"
                  id="last-name"
                  name="last-name"
                  value={account.lastName}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('system.email')}</Label>
                <Input
                  type="text"
                  id="email"
                  name="email"
                  value={account.email}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t('system.phone')}</Label>
                <Input
                  type="text"
                  id="phone"
                  name="phone"
                  value={account.phone}
                />
              </div>
              <Button>{t('system.save')}</Button>
            </Form>
          </TabsContent>
          <TabsContent value="addresses">
            <Form method="POST" className="space-y-4 w-[480px]">
              <p className="text-xl pt-6">{t('system.shipping_address')}</p>
              <p className="text-sm text-muted-foreground">
                {t('system.shipping_address_hint')}
              </p>
              <div className="space-y-2">
                <Label htmlFor="shipping-address-line-1">
                  {t('system.address_line_1')}
                </Label>
                <Input
                  type="text"
                  id="shipping-address-line-1"
                  name="shipping-address-line-1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shipping-address-line-2">
                  {t('system.address_line_2')}
                </Label>
                <Input
                  type="text"
                  id="shipping-address-line-2"
                  name="shipping-address-line-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shipping-address-city">
                  {t('system.city')}
                </Label>
                <Input
                  type="text"
                  id="shipping-address-city"
                  name="shipping-address-city"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shipping-address-state">
                  {t('system.state')}
                </Label>
                <Input
                  type="text"
                  id="shipping-address-state"
                  name="shipping-address-state"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shipping-address-country">
                  {t('system.country')}
                </Label>
                <Input
                  type="text"
                  id="shipping-address-country"
                  name="shipping-address-country"
                />
              </div>
              <p className="text-xl pt-6">{t('system.billing_address')}</p>
              <div>
                <Checkbox />{' '}
                <span className="text-sm text-muted-foreground">
                  {t('system.billing_address_same_shipping_address')}
                </span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing-address-line-1">
                  {t('system.address_line_1')}
                </Label>
                <Input
                  type="text"
                  id="billing-address-line-1"
                  name="billing-address-line-1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing-address-line-2">
                  {t('system.address_line_2')}
                </Label>
                <Input
                  type="text"
                  id="billing-address-line-2"
                  name="billing-address-line-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing-address-city">{t('system.city')}</Label>
                <Input
                  type="text"
                  id="billing-address-city"
                  name="billing-address-city"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing-address-state">
                  {t('system.state')}
                </Label>
                <Input
                  type="text"
                  id="billing-address-state"
                  name="billing-address-state"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing-address-country">
                  {t('system.country')}
                </Label>
                <Input
                  type="text"
                  id="billing-address-country"
                  name="billing-address-country"
                />
              </div>
              <Button>{t('system.save')}</Button>
            </Form>
          </TabsContent>
          <TabsContent value="change-password">
            <Form method="POST" className="space-y-4 w-[480px]">
              <div className="space-y-2">
                <Label htmlFor="old-password">{t('system.old_password')}</Label>
                <Input type="password" id="old-password" name="old-password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">{t('system.new_password')}</Label>
                <Input type="text" id="new-password" name="new-password" />
              </div>
              <Button>{t('system.save')}</Button>
            </Form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Settings
