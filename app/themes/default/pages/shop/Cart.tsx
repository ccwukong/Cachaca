import { useTranslation } from 'react-i18next'
import Header from '~/themes/default/components/ui/Header'
import Footer from '~/themes/default/components/ui/Footer'
import CartItem from '~/themes/default/components/ui/CartItem'
import ProductCard from '~/themes/default/components/ui/ProductCard'
import { Button } from '~/themes/default/components/ui/button'
import { ProductPublicInfo, StoreSettings } from '~/model'

export interface CartItem {
  title: string
  coverImage: string
  price: number
  quantity: number
  currency: string
}

const Cart = ({
  storeSettings,
  items,
  suggestedProducts,
}: {
  storeSettings: StoreSettings
  items: CartItem[]
  suggestedProducts?: ProductPublicInfo[]
}) => {
  const { t } = useTranslation()
  return (
    <div className="mx-6 overflow-hidden lg:mx-0">
      <Header
        storeLogo=""
        storeName="Cachaca"
        menuItems={[
          { title: 'Men', path: '/categories/men' },
          { title: 'Women', path: '/categories/women' },
          { title: 'Accessories', path: '/categories/accessories' },
        ]}
      />
      <div className="max-w-screen-xl mx-auto h-auto pt-28">
        <p className="text-2xl font-light">
          {t('my_cart__ph').replace('{{no_of_items}}', `${items.length}`)}
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            {items.map((item, index) => (
              <CartItem
                key={index}
                coverImage={item.coverImage}
                title={item.title}
                currency={item.currency}
                price={item.price}
                quantity={item.quantity}
              />
            ))}
            <div className="border-t border-gray-200 mt-4">
              <div className="flex justify-between mb-2">
                <div>Subtotal</div>
                <div>$129.00</div>
              </div>
              <div className="flex justify-between mb-2">
                <div>Shipping</div>
                <div className="text-sm text-gray-500">
                  Ground shipping (3-5 business days)
                </div>
                <div>$5.00</div>
              </div>
              <div className="flex justify-between font-bold">
                <div>Total due</div>
                <div>$134.00</div>
              </div>
            </div>
            <div className="mt-4 w-full flex justify-end">
              <div>
                <p className="text-lg font-light text-red-400">
                  Do you have any voucher?
                </p>
                <div className="flex mt-3 justify-between">
                  <input
                    type="text"
                    id="voucher"
                    className="block w-3/4 p-2 mb-2 border border-gray-300 rounded-md"
                    placeholder="Voucher code"
                  />
                  <Button variant="secondary">Add</Button>
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="flex-1">
              <Button className="w-full mb-4" variant="default">
                Login to pay
              </Button>
              <div className="text-center mb-4">Or checkout as Guest</div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium"
                >
                  Email
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
                  Shipping address
                </label>
                <input
                  type="text"
                  id="name"
                  className="block w-full p-2 mb-2 border border-gray-300 rounded-md"
                  placeholder="Name"
                />
                <select
                  id="country"
                  className="block w-full p-2 mb-2 border border-gray-300 rounded-md"
                >
                  <option>United States</option>
                </select>
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
                    Billing address is same as shipping
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="card-info"
                  className="block mb-2 text-sm font-medium"
                >
                  Payment details
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
                Pay $134.00
              </Button>
            </div>
          </div>
        </div>
        <h2 className="mt-16 mb-6 text-xl">You may also want to buy</h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
          {suggestedProducts.map((item) => {
            return (
              <ProductCard
                key={item.id}
                coverImage={item.coverImage}
                title={item.name}
                link={`/products/${item.slug}`}
                price={`${item.currency.symbol}${item.basePrice}`}
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

export default Cart
