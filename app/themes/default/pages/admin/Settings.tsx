import { Form } from '@remix-run/react'
import { MoreHorizontal } from 'lucide-react'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import AdminContext from '~/contexts/adminContext'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/themes/default/components/ui/select'
import { Switch } from '~/themes/default/components/ui/switch'
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
import { ExternalAPIType } from '~/types'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../../components/ui/carousel'

const CustomerList = () => {
  const { t } = useTranslation()
  const { account, storeSettings } = useContext(AdminContext)
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
              <TabsTrigger value="third-party">
                {t('system.thrid-party-services')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="store-settings">
              <Form method="POST" className="space-y-4">
                <div className="w-full grid grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="store-name">{t('system.name')}</Label>
                      <Input
                        type="text"
                        id="store-name"
                        name="store-name"
                        value={storeSettings.name}
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
                        value={storeSettings.description}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-email">{t('system.email')}</Label>
                      <Input
                        type="text"
                        id="store-email"
                        name="store-email"
                        value={storeSettings.email}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-phone">{t('system.phone')}</Label>
                      <Input
                        type="text"
                        id="store-phone"
                        name="store-phone"
                        value={storeSettings.phone}
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
                        value={storeSettings?.address?.address}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-city">{t('system.city')}</Label>
                      <Input
                        type="text"
                        id="store-city"
                        name="store-city"
                        value={storeSettings?.address?.city}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-state">{t('system.state')}</Label>
                      <Input
                        type="text"
                        id="store-state"
                        name="store-state"
                        value={storeSettings?.address?.state}
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
                        value={storeSettings?.address?.country}
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
                        value={storeSettings?.address?.zipcode}
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
                  </div>
                </div>
                <Button>{t('system.save')}</Button>
              </Form>
              <p className="mt-10 text-xl">{t('system.banners')}</p>
              <Form className="mt-3">
                <div className="grid grid-cols-3 gap-24">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="store-banner-autoplay">
                        {t('system.banner_autoplay')}
                      </Label>
                      <div>
                        <Switch
                          checked={storeSettings.banners?.autoplay}
                          id="store-banner-autoplay"
                          name="store-banner-autoplay"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-banner-speed">
                        {t('system.banner_autoplay_speed')}
                      </Label>
                      <Input
                        type="text"
                        id="store-banner-speed"
                        name="store-banner-speed"
                        value={storeSettings.banners?.speed}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-banner-speed">
                        {t('system.banner_autoplay_speed')}
                      </Label>
                      <Input
                        type="text"
                        id="store-banner-speed"
                        name="store-banner-speed"
                        value={storeSettings.banners?.speed}
                      />
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
                <Button className="mt-4">{t('system.save')}</Button>
              </Form>
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
                  <Form method="POST" className="space-y-4 w-[480px]">
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
                    <Button>{t('system.save')}</Button>
                  </Form>
                </TabsContent>
                <TabsContent value="change-password">
                  <Form method="POST" className="space-y-4 w-[480px]">
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
                    <Button>{t('system.save')}</Button>
                  </Form>
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
            <TabsContent value="third-party">
              <Form method="POST" className="space-y-4 w-[480px]">
                <p className="text-xl pt-6">{t('system.generative_ai')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('system.generative_ai_hint')}
                </p>
                <div className="space-y-2">
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
                <p className="text-xl pt-6">{t('system.file_hosting')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('system.file_hosting_hint')}
                </p>
                <div className="space-y-2">
                  <Label>{t('system.provider')}</Label>
                  <Select value="cloudflare-r2">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={t('system.select')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cloudflare-r2">
                        Cloudflare R2
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file-token">
                    {t('system.api_token_or_key')} ({t('system.if_any')})
                  </Label>
                  <Input type="text" id="file-token" name="file-token" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file-access-key-id">
                    {t('system.access_key_id')}
                  </Label>
                  <Input
                    type="text"
                    id="file-access-key-id"
                    name="file-access-key-id"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file-secret-access-key">
                    {t('system.secret_access_key')}
                  </Label>
                  <Input
                    type="text"
                    id="file-secret-access-key"
                    name="file-secret-access-key"
                  />
                </div>
                <p className="text-xl pt-6">{t('system.email_service')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('system.email_service_provider_hint')}
                </p>
                <div className="space-y-2">
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
                      storeSettings.other?.apis.filter(
                        (item) => item.type === ExternalAPIType.Email,
                      )[0]?.config.host
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email-service-provider-token">
                    {t('system.api_token_or_key')} ({t('system.if_any')})
                  </Label>
                  <Input
                    type="password"
                    id="email-token"
                    name="email-token"
                    value={
                      storeSettings.other!.apis.filter(
                        (item) => item.type === ExternalAPIType.Email,
                      )[0]?.config.token
                    }
                  />
                </div>
                <Button>{t('system.save')}</Button>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  )
}

export default CustomerList
