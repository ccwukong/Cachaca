import { Link } from '@remix-run/react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import StoreContext from '~/contexts/storeContext'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/themes/default/components/ui/breadcrumb'
import Footer from '~/themes/default/components/ui/storefront/Footer'
import Header from '~/themes/default/components/ui/storefront/Header'
import { PublicPage } from '~/types'
import { idb } from '~/utils/indexedDB'

const Page = ({ page }: { page: PublicPage }) => {
  const { t } = useTranslation()
  const { storeSettings, publicPages } = useContext(StoreContext)
  return (
    <div className="mx-6 overflow-hidden">
      <Header cartItems={useLiveQuery(() => idb.cart.toArray()) || []} />
      <div className="max-w-screen-xl mx-auto h-auto mt-24">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link to="/">{t('system.home')}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{page.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h2 className="mt-6 mb-6 text-2xl">{page.name}</h2>
        <div
          className="min-h-[500px]"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
      <Footer
        publicPages={publicPages}
        copyright={storeSettings!.other!.copyright}
      />
    </div>
  )
}

export default Page
