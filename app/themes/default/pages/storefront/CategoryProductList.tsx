import { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import Header from '~/themes/default/components/ui/storefront/Header'
import Footer from '~/themes/default/components/ui/storefront/Footer'
import ProductCard from '~/themes/default/components/ui/storefront/ProductCard'
import { ProductPublicInfo, StoreSettings, CategoryItem } from '~/types'
import type { LocalCartItem } from '~/utils/indexedDB'
import * as idb from '~/utils/indexedDB'

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
      const { id, name, coverImage, slug, url, price, currency, quantity } =
        cartItem as LocalCartItem

      await idb.cart.add({
        id,
        name,
        coverImage,
        slug,
        url,
        price,
        currency,
        quantity,
      })
    }
    if (Object.keys(cartItem).length) {
      addItem()
    }
  }, [cartItem])

  return (
    <div className="mx-6 overflow-hidden lg:mx-0">
      <Header
        storeLogo=""
        storeName="Cachaca"
        menuItems={categories}
        cartItems={useLiveQuery(() => idb.cart.toArray()) || []}
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
        pageLinks={storeSettings.pageLinks}
        copyright={storeSettings.copyright}
      />
    </div>
  )
}

export default CategoryProductList
