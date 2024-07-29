import { useLiveQuery } from 'dexie-react-hooks'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import StoreContext from '~/contexts/storeContext'
import Footer from '~/themes/default/components/ui/storefront/Footer'
import Header from '~/themes/default/components/ui/storefront/Header'
import { PublicPage } from '~/types'
import { idb } from '~/utils/indexedDB'

const Page = ({ content }: { content: PublicPage }) => {
  const { t } = useTranslation()
  const { storeSettings, publicPages } = useContext(StoreContext)
  return (
    <div className="mx-6 overflow-hidden">
      <Header cartItems={useLiveQuery(() => idb.cart.toArray()) || []} />

      <div className="max-w-screen-xl mx-auto h-auto pt-10">
        <h2 className="mt-16 mb-6 text-2xl">{content.name}</h2>
        <div dangerouslySetInnerHTML={{ __html: content.content }} />
      </div>
      <Footer
        publicPages={publicPages}
        copyright={storeSettings!.other!.copyright}
      />
    </div>
  )
}

export default Page
