import { useLiveQuery } from 'dexie-react-hooks'
import { useTranslation } from 'react-i18next'
import Footer from '~/themes/default/components/ui/storefront/Footer'
import Header from '~/themes/default/components/ui/storefront/Header'
import { CategoryItem, PublicPage, StoreSettings } from '~/types'
import { idb } from '~/utils/indexedDB'

const Page = ({
  categories,
  storeSettings,
  content,
  publicPages,
}: {
  categories: CategoryItem[]
  storeSettings: StoreSettings
  content: PublicPage
  publicPages: PublicPage[]
}) => {
  const { t } = useTranslation()
  return (
    <div className="mx-6 overflow-hidden">
      <Header
        storeLogo=""
        storeName="Cachaca"
        menuItems={categories}
        cartItems={useLiveQuery(() => idb.cart.toArray()) || []}
      />

      <div className="max-w-screen-xl mx-auto h-auto pt-10">
        <h2 className="mt-16 mb-6 text-2xl">{content.name}</h2>
        <div dangerouslySetInnerHTML={{ __html: content.content }} />
      </div>
      <Footer publicPages={publicPages} copyright={storeSettings.copyright} />
    </div>
  )
}

export default Page
