import { useLiveQuery } from 'dexie-react-hooks'
import Autoplay from 'embla-carousel-autoplay'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '~/themes/default/components/ui/carousel'
import Footer from '~/themes/default/components/ui/storefront/Footer'
import Header from '~/themes/default/components/ui/storefront/Header'
import ProductCard from '~/themes/default/components/ui/storefront/ProductCard'
import { CategoryItem, ProductPublicInfo, StoreSettings } from '~/types'
import type { LocalCartItem } from '~/utils/indexedDB'
import { idb } from '~/utils/indexedDB'

const Home = ({
  categories,
  storeSettings,
  products,
}: {
  categories: CategoryItem[]
  storeSettings: StoreSettings
  products: ProductPublicInfo[]
}) => {
  const { t } = useTranslation()
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

  const updateCartItemHandler = async (id: string, quantity: number) => {
    if (quantity > 0) {
      await idb.cart.update(id, { quantity })
    } else {
      await idb.cart.delete(id)
    }
  }

  return (
    <div className="mx-6 overflow-hidden">
      <Header
        storeLogo={storeSettings.logo}
        storeName={storeSettings.name}
        menuItems={categories}
        cartItems={useLiveQuery(() => idb.cart.toArray()) || []}
        updateCartItemHandler={updateCartItemHandler}
        currency={storeSettings.currency.symbol}
      />

      <div className="max-w-screen-xl mx-auto h-auto pt-24">
        {storeSettings.banners && (
          <Carousel
            className="mb-10"
            plugins={
              storeSettings.banners.autoplay
                ? [
                    Autoplay({
                      delay: storeSettings.banners.speed,
                    }),
                  ]
                : []
            }
          >
            <CarouselContent>
              {storeSettings.banners.items.map((item, idx) => {
                return (
                  <CarouselItem key={idx}>
                    <img
                      src={item.imageUrl}
                      alt={item.caption}
                      className="object-cover w-full h-96"
                    />
                  </CarouselItem>
                )
              })}
            </CarouselContent>
          </Carousel>
        )}
        <h2 className="mt-6 mb-6 text-xl">{t('system.products')}</h2>
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

export default Home
