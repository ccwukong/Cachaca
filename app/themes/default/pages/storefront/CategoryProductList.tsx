import { useState, useEffect } from 'react'
import Header from '~/themes/default/components/ui/storefront/Header'
import Footer from '~/themes/default/components/ui/storefront/Footer'
import ProductCard from '~/themes/default/components/ui/storefront/ProductCard'
import { ProductPublicInfo, StoreSettings, CategoryItem } from '~/types'
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
  const [db, setDb] = useState<IDBDatabase | null>(null)
  const [cartItem, setCartItem] = useState<{ [key: string]: string | number }>(
    {},
  )
  const [cart, setCart] = useState<{ [key: string]: string | number }[]>([])

  useEffect(() => {
    const request = window.indexedDB.open('temp_cart')

    request.onerror = (e) => {
      console.log(e)
    }

    request.onsuccess = (e) => {
      setDb(request.result)
      setCart(idb.findMany(request.result, 'cart_item'))
    }

    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result
      if (db && !db.objectStoreNames.contains('cart_item')) {
        db.createObjectStore('cart_item', { keyPath: 'id' })
      }
      setDb(db)
      setCart(idb.findMany(request.result, 'cart_item'))
    }
  }, [])

  useEffect(() => {
    if (db) {
      idb.insert(db, 'cart_item', cartItem)
      setCart(idb.findMany(db, 'cart_item'))
    }
  }, [cartItem])

  return (
    <div className="mx-6 overflow-hidden lg:mx-0">
      <Header
        storeLogo=""
        storeName="Cachaca"
        menuItems={categories}
        cartItems={cart}
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
