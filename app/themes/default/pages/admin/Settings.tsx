import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import AdminContext from '~/contexts/adminContext'
import AccountForm from '~/themes/default/components/ui/admin/AccountForm'
import ChangePasswordForm from '~/themes/default/components/ui/admin/ChangePasswordForm'
import AdminHeader from '~/themes/default/components/ui/admin/Header'
import ProductCategoryList from '~/themes/default/components/ui/admin/ProductCategoryList'
import ProductVariantList from '~/themes/default/components/ui/admin/ProductVariantList'
import PublicPageList from '~/themes/default/components/ui/admin/PublicPageList'
import StoreInfoForm from '~/themes/default/components/ui/admin/StoreInfoForm'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/themes/default/components/ui/tabs'
import { Currency } from '~/types'
import EmailTemplateList from '../../components/ui/admin/EmailTemplateList'

const Settings = ({ currencies }: { currencies: Currency[] }) => {
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
              <TabsTrigger value="email-templates">
                {t('system.email_templates')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="store-settings">
              <StoreInfoForm currencies={currencies} />
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
                  <AccountForm />
                </TabsContent>
                <TabsContent value="change-password">
                  <ChangePasswordForm />
                </TabsContent>
              </Tabs>
            </TabsContent>
            <TabsContent value="product-categories">
              <ProductCategoryList />
            </TabsContent>
            <TabsContent value="product-variants">
              <ProductVariantList />
            </TabsContent>
            <TabsContent value="public-pages">
              <PublicPageList />
            </TabsContent>
            <TabsContent value="email-templates">
              <EmailTemplateList />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  )
}

export default Settings
