import { useFetcher } from '@remix-run/react'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CustomerContext from '~/contexts/customerContext'
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
import { Spinner } from '../../components/ui/spinner'

const Settings = () => {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const { account } = useContext(CustomerContext)
  const [form, setForm] = useState({
    firstName: account?.firstName,
    lastName: account?.lastName,
    email: account?.email,
    phone: account?.phone,
  })
  return (
    account && (
      <div className="mx-6 overflow-hidden">
        <Header />
        <div className="max-w-screen-xl w-full flex-1 space-y-4 p-8 pt-6 mx-auto h-auto mt-16">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              {t('system.settings')}
            </h2>
          </div>
          <fetcher.Form method="POST">
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
                <div className="space-y-4 w-[480px]">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">{t('system.firstname')}</Label>
                    <Input
                      type="text"
                      id="firstname"
                      name="firstname"
                      value={form.firstName}
                      onChange={(e) => {
                        setForm({
                          ...form,
                          firstName: e.target.value,
                        })
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastname">{t('system.lastname')}</Label>
                    <Input
                      type="text"
                      id="lastname"
                      name="lastname"
                      value={form.lastName}
                      onChange={(e) => {
                        setForm({
                          ...form,
                          lastName: e.target.value,
                        })
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('system.email')}</Label>
                    <Input
                      type="text"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={(e) => {
                        setForm({
                          ...form,
                          email: e.target.value,
                        })
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('system.phone')}</Label>
                    <Input
                      type="text"
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={(e) => {
                        setForm({
                          ...form,
                          phone: e.target.value,
                        })
                      }}
                    />
                  </div>
                  <Button
                    className="mt-4"
                    type="submit"
                    name="intent"
                    value="account-info"
                  >
                    {fetcher.state !== 'idle' ? (
                      <Spinner size="small" className="text-white" />
                    ) : (
                      t('system.save')
                    )}
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="addresses">
                <div className="space-y-4 w-[480px]">
                  <p className="text-xl pt-6">{t('system.shipping_address')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('system.shipping_address_hint')}
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="shipping-address">
                      {t('system.address')}
                    </Label>
                    <Input
                      type="text"
                      id="shipping-address"
                      name="shipping-address"
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
                    <Label htmlFor="billing-address">
                      {t('system.address')}
                    </Label>
                    <Input
                      type="text"
                      id="billing-address"
                      name="billing-address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billing-address-city">
                      {t('system.city')}
                    </Label>
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
                </div>
              </TabsContent>
              <TabsContent value="change-password">
                <div className="space-y-4 w-[480px]">
                  <div className="space-y-2">
                    <Label htmlFor="old-password">
                      {t('system.old_password')}
                    </Label>
                    <Input
                      type="password"
                      id="old-password"
                      name="old-password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">
                      {t('system.new_password')}
                    </Label>
                    <Input type="text" id="new-password" name="new-password" />
                  </div>
                  <Button>{t('system.save')}</Button>
                </div>
              </TabsContent>
            </Tabs>
          </fetcher.Form>
        </div>
      </div>
    )
  )
}

export default Settings
