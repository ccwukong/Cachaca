import { useFetcher } from '@remix-run/react'
import { AlertCircle, MoreHorizontal, Settings } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
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
import {
  AddressItem,
  Currency,
  ExternalApiType,
  OtherStoreConfigs,
} from '~/types'
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert'
import { Spinner } from '../../components/ui/spinner'

const Settings = ({ currencies }: { currencies: Currency[] }) => {
  const { t } = useTranslation()
  const [isRemovingImage, setIsRemovingImage] = useState(false)
  const { account, storeSettings } = useContext(AdminContext)
  const fetcher = useFetcher()
  const [form, setForm] = useState({
    storeName: storeSettings!.name,
    storeDescription: storeSettings!.description,
    storeLogo: storeSettings!.logo,
    storeAddress: storeSettings!.address,
    storePhone: storeSettings!.phone,
    storeEmail: storeSettings!.email,
    storeCurrency: storeSettings!.currency,
    storeOtherInfo: storeSettings!.other!,
    storeBanners: storeSettings!.banners!,
  })

  useEffect(() => {
    if (fetcher.data && !fetcher.data.error && fetcher.data.data.file) {
      if (fetcher.data.data.intent === 'upload-banner') {
        const temp = form.storeBanners?.items || []
        const { id, caption, imageUrl } = fetcher.data.data.file as {
          id: string
          caption: string
          imageUrl: string
        }
        temp.push({
          id,
          imageUrl,
          link: '',
          caption,
          order: -1,
        })

        setForm({
          ...form,
          storeBanners: {
            autoplay: form.storeBanners?.autoplay || false,
            speed: form.storeBanners?.speed || 0,
            items: temp,
          },
        })
      } else if (fetcher.data.data.intent === 'upload-logo') {
        setForm({
          ...form,
          storeLogo: fetcher.data.data.file.imageUrl,
        })
      }
    }
  }, [fetcher.data])

  useEffect(() => {
    if (isRemovingImage) {
      fetcher.submit(
        {
          'store-name': form.storeName,
          'store-banner-items': JSON.stringify(form.storeBanners.items),
          intent: 'remove-banner-image',
        },
        {
          method: 'POST',
        },
      )
      setIsRemovingImage(false)
    }
  }, [isRemovingImage])

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
                      <Label htmlFor="store-logo">{t('system.logo')}</Label>
                      <div className="flex items-center">
                        {form.storeLogo && (
                          <img
                            src={form.storeLogo}
                            alt={form.storeName}
                            className="h-24 w-24 rounded-full border mr-2 object-cover"
                          />
                        )}
                        <Input
                          type="file"
                          id="store-logo"
                          name="store-logo"
                          accept="image/*"
                          className="w-[220px]"
                        />
                        <Button
                          type="submit"
                          variant="secondary"
                          name="intent"
                          value="upload-logo"
                          className="ml-2"
                        >
                          {fetcher.state !== 'idle' &&
                          fetcher.formData?.get('intent') === 'upload-logo' ? (
                            <Spinner size="small" className="text-white" />
                          ) : (
                            t('system.upload')
                          )}
                        </Button>
                      </div>
                    </div>
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
                        type="hidden"
                        name="store-currency"
                        value={form.storeCurrency.id}
                      />
                      <Select
                        value={String(form.storeCurrency.id)}
                        onValueChange={(value) =>
                          setForm({
                            ...form,
                            storeCurrency: currencies.find(
                              (item) => item.id === Number(value),
                            )!,
                          })
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder={t('system.select')} />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((item) => (
                            <SelectItem key={item.id} value={String(item.id)}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      <Label htmlFor="genai-model">{t('system.model')}</Label>
                      <Input
                        type="text"
                        id="genai-model"
                        name="genai-model"
                        value={
                          form.storeOtherInfo?.apis[ExternalApiType.GenAI]
                            ?.model
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
                                  model: e.target.value,
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
                      <Label htmlFor="genai-api-key">
                        {t('system.api_key')}
                      </Label>
                      <Input
                        type="password"
                        id="genai-api-key"
                        name="genai-api-key"
                        value={
                          form.storeOtherInfo?.apis[ExternalApiType.GenAI]
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
                                },
                                [ExternalApiType.GenAI]: {
                                  ...form.storeOtherInfo?.apis[
                                    ExternalApiType.GenAI
                                  ],
                                  apiKey: e.target.value,
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
                <Button
                  className="mt-4"
                  type="submit"
                  name="intent"
                  value="store-info"
                >
                  {fetcher.state !== 'idle' &&
                  fetcher.formData?.get('intent') === 'store-info' ? (
                    <Spinner size="small" className="text-white" />
                  ) : (
                    t('system.save')
                  )}
                </Button>
                <p className="mt-10 text-xl">{t('system.banners')}</p>
                <div className="grid grid-cols-3 gap-24 mt-3">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Checkbox
                        checked={form.storeBanners.autoplay}
                        id="store-banner-autoplay"
                        name="store-banner-autoplay"
                        onCheckedChange={(checked) => {
                          setForm({
                            ...form,
                            storeBanners: {
                              ...form.storeBanners,
                              autoplay: checked as boolean,
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
                        value={form.storeBanners.speed}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            storeBanners: {
                              ...form.storeBanners,
                              speed: Number(e.target.value),
                            },
                          })
                        }}
                      />
                    </div>
                    <Input
                      type="hidden"
                      name="store-banner-items"
                      value={JSON.stringify(form.storeBanners.items)}
                    />
                    <Button
                      className="mt-4"
                      type="submit"
                      name="intent"
                      value="store-banners"
                    >
                      {fetcher.state !== 'idle' &&
                      fetcher.formData?.get('intent') === 'store-banners' ? (
                        <Spinner size="small" className="text-white" />
                      ) : (
                        t('system.save')
                      )}
                    </Button>
                  </div>
                  <div className="col-span-2 w-full space-y-3">
                    <p>{t('system.banner_images')}</p>
                    <div className="flex">
                      <Input
                        type="file"
                        id="store-banner-upload"
                        name="store-banner-upload"
                        className="w-[240px]"
                        accept="image/*"
                      />
                      <Button
                        type="submit"
                        variant="secondary"
                        name="intent"
                        value="upload-banner"
                        className="ml-2"
                      >
                        {fetcher.state !== 'idle' &&
                        fetcher.formData?.get('intent') === 'upload-banner' ? (
                          <Spinner size="small" className="text-white" />
                        ) : (
                          t('system.upload')
                        )}
                      </Button>
                    </div>
                    {form.storeBanners.items
                      .sort((a, b) => {
                        return a.order - b.order
                      })
                      .map((item) => {
                        return (
                          <div className="w-full flex" key={item.id}>
                            <img
                              src={item.imageUrl}
                              alt={item.caption}
                              className="w-[120px]"
                            />
                            <Button
                              variant="link"
                              name="intent"
                              value="remove-banner-image"
                              onClick={() => {
                                setForm({
                                  ...form,
                                  storeBanners: {
                                    ...form.storeBanners,
                                    items: form.storeBanners.items.filter(
                                      (i) => i.id !== item.id,
                                    ),
                                  },
                                })
                                setIsRemovingImage(true)
                              }}
                            >
                              {t('system.remove')}
                            </Button>
                          </div>
                        )
                      })}
                  </div>
                </div>
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
                          type="password"
                          id="new-password"
                          name="new-password"
                        />
                      </div>
                      <Button
                        type="submit"
                        name="intent"
                        value="change-password"
                      >
                        {fetcher.state !== 'idle' &&
                        fetcher.formData?.get('intent') ===
                          'change-password' ? (
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
              </TabsContent>
              <TabsContent value="product-categories">
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
              <TabsContent value="product-variants">
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

export default Settings
