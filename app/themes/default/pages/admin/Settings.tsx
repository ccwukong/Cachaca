import { useFetcher } from '@remix-run/react'
import { MoreHorizontal } from 'lucide-react'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AdminContext from '~/contexts/adminContext'
import AdminHeader from '~/themes/default/components/ui/admin/Header'
import { Button } from '~/themes/default/components/ui/button'
import { Checkbox } from '~/themes/default/components/ui/checkbox'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/themes/default/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/themes/default/components/ui/table'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/themes/default/components/ui/tabs'
import { Textarea } from '~/themes/default/components/ui/textarea'
import { AddressItem, ExternalApiType, OtherStoreConfigs } from '~/types'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../../components/ui/carousel'
import { Spinner } from '../../components/ui/spinner'

const CustomerList = () => {
  const { t } = useTranslation()
  const { account, storeSettings } = useContext(AdminContext)
  const fetcher = useFetcher()
  const [form, setForm] = useState({
    storeName: storeSettings?.name,
    storeDescription: storeSettings?.description,
    storeLogo: storeSettings?.logo,
    storeAddress: storeSettings?.address,
    storePhone: storeSettings?.phone,
    storeEmail: storeSettings?.email,
    storeCurrency: storeSettings?.currency,
    storeOtherInfo: storeSettings?.other,
    storeBanners: storeSettings?.banners,
  })
  return (
    account &&
    storeSettings && (
      <div className="mx-6 overflow-hidden">
        <AdminHeader />
        <div className="max-w-screen-xl w-full flex-1 space-y-4 p-8 pt-6 mx-auto h-auto mt-16">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              {t('system.settings')}
            </h2>
          </div>
          <fetcher.Form method="POST" encType="multipart/form-data">
            <Tabs defaultValue="store-settings" className="w-full">
              <TabsList>
                <TabsTrigger value="store-settings">
                  {t('system.store_settings')}
                </TabsTrigger>
                <TabsTrigger value="account-settings">
                  {t('system.account_settings')}
                </TabsTrigger>
                <TabsTrigger value="product-categories">
                  {t('system.product_categories')}
                </TabsTrigger>
                <TabsTrigger value="product-variants">
                  {t('system.product_variants')}
                </TabsTrigger>
                <TabsTrigger value="public-pages">
                  {t('system.public_pages')}
                </TabsTrigger>
                <TabsTrigger value="payment">{t('system.payment')}</TabsTrigger>
              </TabsList>
              <TabsContent value="store-settings">
                <p className="text-xl space-y-3 mt-3">
                  {t('system.store_information')}
                </p>
                <div className="w-full grid grid-cols-3 gap-10">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="store-name">{t('system.name')}</Label>
                      <Input
                        type="text"
                        id="store-name"
                        name="store-name"
                        value={form.storeName}
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-logo">{t('system.logo')}</Label>
                      <Input type="file" id="store-logo" name="store-logo" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-description">
                        {t('system.description')}
                      </Label>
                      <Textarea
                        id="store-description"
                        name="store-description"
                        value={form.storeDescription}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            storeDescription: e.target.value,
                          })
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-email">{t('system.email')}</Label>
                      <Input
                        type="text"
                        id="store-email"
                        name="store-email"
                        value={form.storeEmail}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            storeEmail: e.target.value,
                          })
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-phone">{t('system.phone')}</Label>
                      <Input
                        type="text"
                        id="store-phone"
                        name="store-phone"
                        value={form.storePhone}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            storePhone: e.target.value,
                          })
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="store-address">
                        {t('system.address')}
                      </Label>
                      <Input
                        type="text"
                        id="store-address"
                        name="store-address"
                        value={form?.storeAddress?.address}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            storeAddress: {
                              ...form.storeAddress,
                              address: e.target.value,
                            } as AddressItem,
                          })
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-city">{t('system.city')}</Label>
                      <Input
                        type="text"
                        id="store-city"
                        name="store-city"
                        value={form?.storeAddress?.city}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            storeAddress: {
                              ...form.storeAddress,
                              city: e.target.value,
                            } as AddressItem,
                          })
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-state">{t('system.state')}</Label>
                      <Input
                        type="text"
                        id="store-state"
                        name="store-state"
                        value={form?.storeAddress?.state}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            storeAddress: {
                              ...form.storeAddress,
                              state: e.target.value,
                            } as AddressItem,
                          })
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-country">
                        {t('system.country')}
                      </Label>
                      <Input
                        type="text"
                        id="store-country"
                        name="store-country"
                        value={form?.storeAddress?.country}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            storeAddress: {
                              ...form.storeAddress,
                              country: e.target.value,
                            } as AddressItem,
                          })
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-zipcode">
                        {t('system.zipcode')}
                      </Label>
                      <Input
                        type="text"
                        id="store-zipcode"
                        name="store-zipcode"
                        value={form?.storeAddress?.zipcode}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            storeAddress: {
                              ...form.storeAddress,
                              zipcode: e.target.value,
                            } as AddressItem,
                          })
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="store-currency">
                        {t('system.base_currency')}
                      </Label>
                      <Input
                        type="text"
                        id="store-currency"
                        name="store-currency"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-copyright-info">
                        {t('system.copyright_info')}
                      </Label>
                      <Input
                        type="text"
                        id="store-copyright-info"
                        name="store-copyright-info"
                        value={form?.storeOtherInfo?.copyright}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            storeOtherInfo: {
                              ...form.storeOtherInfo,
                              copyright: e.target.value,
                            } as OtherStoreConfigs,
                          })
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full grid grid-cols-3 gap-10 mt-10">
                  <div className="space-y-3">
                    <p className="text-xl">{t('system.generative_ai')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('system.generative_ai_hint')}
                    </p>
                    <div className="space-y-2 mt-3">
                      <Label>{t('system.provider')}</Label>
                      <Select value="openai">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder={t('system.select')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="openai">OpenAI</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ai-model">{t('system.model')}</Label>
                      <Input type="text" id="ai-model" name="ai-model" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ai-api-key">{t('system.api_key')}</Label>
                      <Input type="text" id="ai-api-key" name="ai-api-key" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xl">{t('system.file_hosting')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('system.file_hosting_hint')}
                    </p>
                    <div className="space-y-2 mt-3">
                      <Label>{t('system.provider')}</Label>
                      <Select value="cloudinary">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder={t('system.select')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cloudinary">Cloudinary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="file-cloud-name">
                        {t('system.cloud_name')} ({t('system.for_cloudinary')})
                      </Label>
                      <Input
                        type="text"
                        id="file-cloud-name"
                        name="file-cloud-name"
                        value={
                          form.storeOtherInfo?.apis[ExternalApiType.File]
                            ?.cloudName
                        }
                        onChange={(e) => {
                          setForm({
                            ...form,
                            storeOtherInfo: {
                              copyright: form.storeOtherInfo?.copyright || '',
                              apis: {
                                [ExternalApiType.File]: {
                                  ...form.storeOtherInfo?.apis[
                                    ExternalApiType.File
                                  ],
                                  cloudName: e.target.value,
                                },
                                [ExternalApiType.GenAI]: {
                                  ...form.storeOtherInfo?.apis[
                                    ExternalApiType.GenAI
                                  ],
                                },
                                [ExternalApiType.Email]: {
                                  ...form.storeOtherInfo?.apis[
                                    ExternalApiType.Email
                                  ],
                                },
                              },
                            },
                          })
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="file-api-key">
                        {t('system.api_key')}
                      </Label>
                      <Input
                        type="text"
                        id="file-api-key"
                        name="file-api-key"
                        value={
                          form.storeOtherInfo?.apis[ExternalApiType.File]
                            ?.apiKey
                        }
                        onChange={(e) => {
                          setForm({
                            ...form,
                            storeOtherInfo: {
                              copyright: form.storeOtherInfo?.copyright || '',
                              apis: {
                                [ExternalApiType.File]: {
                                  ...form.storeOtherInfo?.apis[
                                    ExternalApiType.File
                                  ],
                                  apiKey: e.target.value,
                                },
                                [ExternalApiType.GenAI]: {
                                  ...form.storeOtherInfo?.apis[
                                    ExternalApiType.GenAI
                                  ],
                                },
                                [ExternalApiType.Email]: {
                                  ...form.storeOtherInfo?.apis[
                                    ExternalApiType.Email
                                  ],
                                },
                              },
                            },
                          })
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="file-api-secret">
                        {t('system.api_secret')}
                      </Label>
                      <Input
                        type="password"
                        id="file-api-secret"
                        name="file-api-secret"
                        value={
                          form.storeOtherInfo?.apis[ExternalApiType.File]
                            ?.apiSecret
                        }
                        onChange={(e) => {
                          setForm({
                            ...form,
                            storeOtherInfo: {
                              copyright: form.storeOtherInfo?.copyright || '',
                              apis: {
                                [ExternalApiType.File]: {
                                  ...form.storeOtherInfo?.apis[
                                    ExternalApiType.File
                                  ],
                                  apiSecret: e.target.value,
                                },
                                [ExternalApiType.GenAI]: {
                                  ...form.storeOtherInfo?.apis[
                                    ExternalApiType.GenAI
                                  ],
                                },
                                [ExternalApiType.Email]: {
                                  ...form.storeOtherInfo?.apis[
                                    ExternalApiType.Email
                                  ],
                                },
                              },
                            },
                          })
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xl">{t('system.email_service')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('system.email_service_provider_hint')}
                    </p>
                    <div className="space-y-2 mt-3">
                      <Label>{t('system.provider')}</Label>
                      <Select value="mailtrap">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder={t('system.select')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mailtrap">Mailtrap</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-service-provider-host">
                        {t('system.api_endpoint')}
                      </Label>
                      <Input
                        type="text"
                        id="email-endpoint"
                        name="email-endpoint"
                        value={
                          form.storeOtherInfo?.apis[ExternalApiType.Email]
                            ?.endpoint
                        }
                        onChange={(e) => {
                          setForm({
                            ...form,
                            storeOtherInfo: {
                              copyright: form.storeOtherInfo?.copyright || '',
                              apis: {
                                [ExternalApiType.File]: {
                                  ...form.storeOtherInfo?.apis[
                                    ExternalApiType.File
                                  ],
                                },
                                [ExternalApiType.GenAI]: {
                                  ...form.storeOtherInfo?.apis[
                                    ExternalApiType.GenAI
                                  ],
                                },
                                [ExternalApiType.Email]: {
                                  ...form.storeOtherInfo?.apis[
                                    ExternalApiType.Email
                                  ],
                                  endpoint: e.target.value,
                                },
                              },
                            },
                          })
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email-service-provider-token">
                        {t('system.api_token')}
                      </Label>
                      <Input
                        type="password"
                        id="email-token"
                        name="email-token"
                        value={
                          form.storeOtherInfo?.apis[ExternalApiType.Email]
                            ?.token
                        }
                        onChange={(e) => {
                          setForm({
                            ...form,
                            storeOtherInfo: {
                              copyright: form.storeOtherInfo?.copyright || '',
                              apis: {
                                [ExternalApiType.File]: {
                                  ...form.storeOtherInfo?.apis[
                                    ExternalApiType.File
                                  ],
                                },
                                [ExternalApiType.GenAI]: {
                                  ...form.storeOtherInfo?.apis[
                                    ExternalApiType.GenAI
                                  ],
                                },
                                [ExternalApiType.Email]: {
                                  ...form.storeOtherInfo?.apis[
                                    ExternalApiType.Email
                                  ],
                                  token: e.target.value,
                                },
                              },
                            },
                          })
                        }}
                      />
                    </div>
                  </div>
                </div>
                <p className="mt-10 text-xl">{t('system.banners')}</p>
                <div className="grid grid-cols-3 gap-24 mt-3">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Checkbox
                        checked={form.storeBanners?.autoplay}
                        id="store-banner-autoplay"
                        name="store-banner-autoplay"
                        onCheckedChange={(checked) => {
                          setForm({
                            ...form,
                            storeBanners: {
                              autoplay: checked as boolean,
                              speed: form.storeBanners?.speed || 0,
                              items: form.storeBanners?.items || [],
                            },
                          })
                        }}
                      />{' '}
                      <Label htmlFor="store-banner-autoplay">
                        {t('system.banner_autoplay')}
                      </Label>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-banner-speed">
                        {t('system.banner_autoplay_speed')}
                      </Label>
                      <Input
                        type="number"
                        id="store-banner-speed"
                        name="store-banner-speed"
                        value={form.storeBanners?.speed}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            storeBanners: {
                              autoplay: form.storeBanners?.autoplay || false,
                              speed: Number(e.target.value),
                              items: form.storeBanners?.items || [],
                            },
                          })
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-banner-upload">
                        {t('system.upload_banner_image')}
                      </Label>
                      <div className="flex justify-between">
                        <Input
                          type="file"
                          id="store-banner-upload"
                          name="store-banner-upload"
                          accept="image/*"
                        />
                        <Button
                          type="submit"
                          variant="link"
                          name="intent"
                          value="upload-banner"
                        >
                          {t('system.upload')}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 w-full space-y-3">
                    <p>{t('system.preview')}</p>
                    <Carousel className="w-2/3 h-[200px]">
                      <CarouselContent>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <CarouselItem key={index}>
                            <img
                              src="https://images.unsplash.com/photo-1462927114214-6956d2fddd4e?q=80&w=3869&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                              className="w-full h-[200px] object-cover"
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious type="button" />
                      <CarouselNext type="button" />
                    </Carousel>
                  </div>
                </div>
                <Button
                  className="mt-4"
                  type="submit"
                  name="intent"
                  value="store-info"
                >
                  {fetcher.state !== 'idle' ? (
                    <Spinner size="small" className="text-white" />
                  ) : (
                    t('system.save')
                  )}
                </Button>
              </TabsContent>
              <TabsContent value="account-settings">
                <Tabs defaultValue="account-settings" className="w-full">
                  <TabsList>
                    <TabsTrigger value="account-settings">
                      {t('system.account_settings')}
                    </TabsTrigger>
                    <TabsTrigger value="change-password">
                      {t('system.change_password')}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="account-settings">
                    <div className="space-y-4 w-[480px]">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">
                          {t('system.firstname')}
                        </Label>
                        <Input
                          type="text"
                          id="first-name"
                          name="first-name"
                          value={account.firstName}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="store-email">
                          {t('system.lastname')}
                        </Label>
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
                      <Button type="submit" name="intent" value="account-info">
                        {t('system.save')}
                      </Button>
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
                        <Input
                          type="text"
                          id="new-password"
                          name="new-password"
                        />
                      </div>
                      <Button
                        type="submit"
                        name="intent"
                        value="account-password"
                      >
                        {t('system.save')}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </TabsContent>
              <TabsContent value="product-categories">
                {t('system.product_categories')}
              </TabsContent>
              <TabsContent value="product-variants">
                {t('system.product_variants')}
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
                  {storeSettings.publicPages.length ? (
                    <TableBody>
                      {storeSettings.publicPages.map((item) => (
                        <TableRow key={item.name}>
                          <TableCell className="font-medium">
                            {item.name}
                          </TableCell>
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
            </Tabs>
          </fetcher.Form>
        </div>
      </div>
    )
  )
}

export default CustomerList
