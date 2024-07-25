import { useFetcher } from '@remix-run/react'
import { AlertCircle } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CustomerContext from '~/contexts/customerContext'
import Header from '~/themes/default/components/ui/account/Header'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '~/themes/default/components/ui/alert'
import { Button } from '~/themes/default/components/ui/button'
import { Input } from '~/themes/default/components/ui/input'
import { Label } from '~/themes/default/components/ui/label'
import { Spinner } from '~/themes/default/components/ui/spinner'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/themes/default/components/ui/tabs'
import { AddressItem, AddressType } from '~/types'

const Settings = ({ addressItems }: { addressItems: AddressItem[] }) => {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const { account } = useContext(CustomerContext)
  const shippingAddress = addressItems.filter(
    (item) => item.type === AddressType.Shipping,
  )[0]
  const billingAddress = addressItems.filter(
    (item) => item.type === AddressType.Billing,
  )[0]
  const [form, setForm] = useState({
    firstName: account?.firstName,
    lastName: account?.lastName,
    email: account?.email,
    phone: account?.phone,
    shippingAddress: shippingAddress,
    billingAddress: billingAddress,
  })

  useEffect(() => {
    if (fetcher.data && !fetcher.data.error) {
      if (fetcher.data.data.intent === 'update-address') {
        setForm({
          ...form,
          shippingAddress: fetcher.data.data.shippingAddress,
          billingAddress: fetcher.data.data.billingAddress,
        })
      }
    }
  }, [fetcher.data])

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
                    <Label htmlFor="firstname">{t('system.firstname')}</Label>
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
                <div className="grid grid-cols-3 gap-10">
                  <div className="space-y-3">
                    <p className="text-xl">{t('system.shipping_address')}</p>
                    <div className="space-y-2">
                      <Label htmlFor="shipping-address">
                        {t('system.address')}
                      </Label>
                      <Input
                        type="text"
                        id="shipping-address"
                        name="shipping-address"
                        value={form.shippingAddress?.address || ''}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            shippingAddress: {
                              ...(form.shippingAddress || {}),
                              address: e.target.value,
                            },
                          })
                        }}
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
                        value={form.shippingAddress?.city || ''}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            shippingAddress: {
                              ...(form.shippingAddress || {}),
                              city: e.target.value,
                            },
                          })
                        }}
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
                        value={form.shippingAddress?.state || ''}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            shippingAddress: {
                              ...(form.shippingAddress || {}),
                              state: e.target.value,
                            },
                          })
                        }}
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
                        value={form.shippingAddress?.country || ''}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            shippingAddress: {
                              ...(form.shippingAddress || {}),
                              country: e.target.value,
                            },
                          })
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shipping-address-zipcode">
                        {t('system.zipcode')}
                      </Label>
                      <Input
                        type="text"
                        id="shipping-address-zipcode"
                        name="shipping-address-zipcode"
                        value={form.shippingAddress?.zipcode || ''}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            shippingAddress: {
                              ...(form.shippingAddress || {}),
                              zipcode: e.target.value,
                            },
                          })
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xl">{t('system.billing_address')}</p>
                    <div className="space-y-2">
                      <Label htmlFor="billing-address">
                        {t('system.address')}
                      </Label>
                      <Input
                        type="text"
                        id="billing-address"
                        name="billing-address"
                        value={form.billingAddress?.address || ''}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            billingAddress: {
                              ...(form.billingAddress || {}),
                              address: e.target.value,
                            },
                          })
                        }}
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
                        value={form.billingAddress?.city || ''}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            billingAddress: {
                              ...(form.billingAddress || {}),
                              city: e.target.value,
                            },
                          })
                        }}
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
                        value={form.billingAddress?.state || ''}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            billingAddress: {
                              ...(form.billingAddress || {}),
                              state: e.target.value,
                            },
                          })
                        }}
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
                        value={form.billingAddress?.country || ''}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            billingAddress: {
                              ...(form.billingAddress || {}),
                              country: e.target.value,
                            },
                          })
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billing-address-zipcode">
                        {t('system.zipcode')}
                      </Label>
                      <Input
                        type="text"
                        id="billing-address-zipcode"
                        name="billing-address-zipcode"
                        value={form.billingAddress?.zipcode || ''}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            billingAddress: {
                              ...(form.billingAddress || {}),
                              zipcode: e.target.value,
                            },
                          })
                        }}
                      />
                    </div>
                  </div>
                  <div></div>
                </div>
                <Input
                  type="hidden"
                  name="shipping-address-id"
                  value={form.shippingAddress?.id || ''}
                />
                <Input
                  type="hidden"
                  name="billing-address-id"
                  value={form.billingAddress?.id || ''}
                />
                <Button
                  type="submit"
                  name="intent"
                  value="update-address"
                  className="mt-4"
                >
                  {fetcher.state !== 'idle' &&
                  fetcher.formData?.get('intent') === 'update-address' ? (
                    <Spinner size="small" className="text-white" />
                  ) : (
                    t('system.save')
                  )}
                </Button>
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
                    <Input
                      type="password"
                      id="new-password"
                      name="new-password"
                    />
                  </div>
                  <Button type="submit" name="intent" value="change-password">
                    {fetcher.state !== 'idle' &&
                    fetcher.formData?.get('intent') === 'change-password' ? (
                      <Spinner size="small" className="text-white" />
                    ) : (
                      t('system.save')
                    )}
                  </Button>
                  {fetcher.state === 'idle' && fetcher.data?.error ? (
                    <Alert variant="destructive" className="mt-3">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>{t('system.error')}</AlertTitle>
                      <AlertDescription>
                        {t('system.unmatched_password')}
                      </AlertDescription>
                    </Alert>
                  ) : null}
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
