import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useState } from 'react'
import Footer from '~/themes/default/components/ui/storefront/Footer'
import Header from '~/themes/default/components/ui/storefront/Header'
import ProductCard from '~/themes/default/components/ui/storefront/ProductCard'
import { CategoryItem, ProductPublicInfo, StoreSettings } from '~/types'
import type { LocalCartItem } from '~/utils/indexedDB'
import { idb } from '~/utils/indexedDB'

const CategoryProductList = ({
  categories,
  storeSettings,
  products,
  category,
}: {
  categories: CategoryItem[]
  products: ProductPublicInfo[]
  storeSettings: StoreSettings
  category: string
}) => {
  const [cartItem, setCartItem] = useState<{ [key: string]: string | number }>(
    {},
  )

  useEffect(() => {
    const addItem = async () => {
      const { id, name, coverImage, slug, url, price, quantity } =
        cartItem as LocalCartItem

      const item = await idb.cart.get(id)
      if (item) {
        await idb.cart.update(id, { quantity: item.quantity + 1 })
      } else {
        await idb.cart.add({
          id,
          name,
          coverImage,
          slug,
          url,
          price,
          quantity,
        })
      }
    }
    if (Object.keys(cartItem).length) {
      addItem()
    }
  }, [cartItem])

  return (
    <div className="mx-6 overflow-hidden">
      <Header
        storeLogo={storeSettings.logo}
        storeName={storeSettings.name}
        menuItems={categories}
        cartItems={useLiveQuery(() => idb.cart.toArray()) || []}
        currency={storeSettings.currency.symbol}
      />

      <div className="max-w-screen-xl mx-auto h-auto pt-24">
        <h2 className="mb-6 text-xl">{category}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
          {products.map((item) => {
            return (
              <ProductCard
                key={item.id}
                coverImage={item.coverImage}
                title={item.name}
                link={`/products/${item.slug}`}
                price={`${storeSettings.currency.symbol}${item.basePrice}`}
                onClick={() => {
                  setCartItem({
                    id: item.id,
                    coverImage: item.coverImage,
                    name: item.name,
                    url: `/products/${item.slug}`,
                    price: item.basePrice,
                    quantity: 1,
                    slug: item.slug,
                    currency: storeSettings.currency.symbol,
                  })
                }}
              />
            )
          })}
        </div>
      </div>
      <Footer
        publicPages={storeSettings.publicPages}
        copyright={storeSettings?.other?.copyright}
      />
    </div>
  )
}

export default CategoryProductList
