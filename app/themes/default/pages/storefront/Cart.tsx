import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '~/themes/default/components/ui/button'
import CartItem from '~/themes/default/components/ui/storefront/CartItem'
import Footer from '~/themes/default/components/ui/storefront/Footer'
import Header from '~/themes/default/components/ui/storefront/Header'
import ProductCard from '~/themes/default/components/ui/storefront/ProductCard'
import { CategoryItem, ProductPublicInfo, StoreSettings } from '~/types'
import type { LocalCartItem } from '~/utils/indexedDB'
import { idb } from '~/utils/indexedDB'

const Cart = ({
  categories,
  storeSettings,
  suggestedProducts,
  shippingFee,
  allowVoucher,
  allowGuestCheckout,
  account,
}: {
  categories: CategoryItem[]
  storeSettings: StoreSettings
  suggestedProducts?: ProductPublicInfo[]
  shippingFee: string
  allowVoucher: boolean
  allowGuestCheckout: boolean
  account: {
    id: string
    firstName: string
    lastName: string
    email: string
  } | null
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [cartItem, setCartItem] = useState<{
    [key: string]: string | number
  }>({})

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

  const cart = useLiveQuery(() => idb.cart.toArray()) || []

  const subtotal = cart.reduce(
    (accu, item) => accu + Number(item.price) * item.quantity,
    0,
  )
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
        cartItems={cart}
        updateCartItemHandler={updateCartItemHandler}
        currency={storeSettings.currency.symbol}
      />
      <div className="max-w-screen-xl mx-auto h-auto pt-24">
        <p className="text-2xl font-light">
          {t('system.my_cart_ph', { no_of_items: cart.length })}
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            {cart.map((item) => (
              <CartItem
                key={item.id}
                id={item.id}
                slug={item.slug}
                coverImage={item.coverImage}
                title={item.name}
                currency={storeSettings.currency.symbol}
                price={item.price}
                quantity={item.quantity}
                updateCartItemHandler={updateCartItemHandler}
              />
            ))}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between mb-2">
                <div>{t('system.subtotal')}</div>
                <div>{`${storeSettings.currency.symbol}${subtotal}`}</div>
              </div>
              <div className="flex justify-between mb-2">
                <div> {t('system.shipping')}</div>
                <div>{`${storeSettings.currency.symbol}${shippingFee}`}</div>
              </div>
              <div className="flex justify-between font-bold">
                <div>
                  <div> {t('system.total_due')}</div>
                </div>
                <div>{`${storeSettings.currency.symbol}${
                  Number(subtotal) + Number(shippingFee)
                }`}</div>
              </div>
            </div>
            {allowVoucher && (
              <div className="mt-4 w-full flex justify-end">
                <div>
                  <p className="text-lg font-light text-red-400">
                    {t('system.cart_voucher_hint')}
                  </p>
                  <div className="flex mt-3 justify-between">
                    <input
                      type="text"
                      id="voucher"
                      className="block w-3/4 p-2 mb-2 border border-gray-300 rounded-md"
                      placeholder="Voucher code"
                    />
                    <Button variant="secondary">{t('system.add')}</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="md:col-span-2">
            {account ? (
              <div>Something</div>
            ) : (
              <div className="flex-1">
                <Button
                  className="w-full mb-4"
                  variant="default"
                  onClick={() => {
                    navigate('/login?ref=cart')
                  }}
                >
                  Login to pay
                </Button>
                {allowGuestCheckout && (
                  <>
                    <div className="text-center mb-4">
                      {t('system.checkout_as_guest')}
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium"
                      >
                        {t('system.email')}
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="block w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Email"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="country"
                        className="block mb-2 text-sm font-medium"
                      >
                        {t('system.shipping_address')}
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="block w-full p-2 mb-2 border border-gray-300 rounded-md"
                        placeholder="Name"
                      />
                      <input
                        type="text"
                        id="country"
                        className="block w-full p-2 mb-2 border border-gray-300 rounded-md"
                        placeholder="Country"
                      />
                      <input
                        type="text"
                        id="address"
                        className="block w-full p-2 mb-2 border border-gray-300 rounded-md"
                        placeholder="Address"
                      />
                      <div className="flex items-center mb-4">
                        <input
                          id="billing-address"
                          type="checkbox"
                          className="w-4 h-4 mr-2"
                        />
                        <label htmlFor="billing-address" className="text-sm">
                          {t('system.billing_address_same_shipping_address')}
                        </label>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="card-info"
                        className="block mb-2 text-sm font-medium"
                      >
                        {t('system.payment_details')}
                      </label>
                      <input
                        type="text"
                        id="card-info"
                        className="block w-full p-2 mb-2 border border-gray-300 rounded-md"
                        placeholder="Card information"
                      />
                      <div className="flex justify-between">
                        <input
                          type="text"
                          id="expiry-date"
                          className="block w-1/3 p-2 mb-2 mr-2 border border-gray-300 rounded-md"
                          placeholder="MM / YY"
                        />
                        <input
                          type="text"
                          id="cvc"
                          className="block w-1/3 p-2 mb-2 border border-gray-300 rounded-md"
                          placeholder="CVC"
                        />
                      </div>
                    </div>

                    <Button className="w-full" variant="default">
                      {t('system.pay_amount', {
                        amount: `${storeSettings.currency.symbol}${
                          Number(subtotal) + Number(shippingFee)
                        }`,
                      })}
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        {suggestedProducts && (
          <>
            <h2 className="mt-16 mb-6 text-xl">You may also want to buy</h2>
            <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
              {suggestedProducts.map((item) => {
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
          </>
        )}
      </div>
      <Footer
        publicPages={storeSettings.publicPages}
        copyright={storeSettings.copyright}
      />
    </div>
  )
}

export default Cart
