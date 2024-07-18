import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '~/themes/default/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/themes/default/components/ui/select'
import Footer from '~/themes/default/components/ui/storefront/Footer'
import Header from '~/themes/default/components/ui/storefront/Header'
import {
  CategoryItem,
  ProductPublicInfo,
  PublicPage,
  StoreSettings,
} from '~/types'
import type { LocalCartItem } from '~/utils/indexedDB'
import { idb } from '~/utils/indexedDB'

const ProductDetail = ({
  categories,
  storeSettings,
  product,
  publicPages,
}: {
  categories: CategoryItem[]
  product: ProductPublicInfo | null
  storeSettings: StoreSettings
  publicPages: PublicPage[]
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
        storeLogo=""
        storeName="Cachaca"
        menuItems={categories}
        cartItems={useLiveQuery(() => idb.cart.toArray()) || []}
        updateCartItemHandler={updateCartItemHandler}
      />
      <div className="max-w-screen-xl mx-auto h-auto pt-24">
        {product && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 md:col-span-3 gap-2">
              {product.images.map((item, idx) => {
                return (
                  <img
                    key={idx}
                    src={item}
                    alt={product.name}
                    className="object-cover w-full h-76"
                  />
                )
              })}
            </div>
            <div className="md:col-span-2">
              <p className="text-xl font-light">{product.name}</p>
              <p className="text-2xl mt-5">{`${storeSettings.currency.symbol}${product.basePrice}`}</p>
              <p
                className="mt-5"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
              <p className="text-lg mt-6">Size</p>
              <div className="mt-3">
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xs">XS</SelectItem>
                    <SelectItem value="s">S</SelectItem>
                    <SelectItem value="m">M</SelectItem>
                    <SelectItem value="l">L</SelectItem>
                    <SelectItem value="xl">XL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-lg mt-6">Color</p>
              <div className="mt-3">
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="white">White (+$10)</SelectItem>
                    <SelectItem value="Black">Black</SelectItem>
                    <SelectItem value="Gray">Gray</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="secondary"
                className="w-full mt-10"
                onClick={() => {
                  setCartItem({
                    id: product.id,
                    coverImage: product.coverImage,
                    name: product.name,
                    url: `/products/${product.slug}`,
                    price: product.basePrice,
                    quantity: 1,
                    slug: product.slug,
                    currency: storeSettings.currency.symbol,
                  })
                }}
              >
                {t('system.add_cart')}
              </Button>
            </div>
          </div>
        )}
      </div>
      <Footer publicPages={publicPages} copyright={storeSettings.copyright} />
    </div>
  )
}

export default ProductDetail
