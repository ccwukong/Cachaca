import type { MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import Cart from '~/themes/default/pages/storefront/Cart'
import {
  CartItemInfo,
  ProductModel,
  CategoryItem,
  StoreSettings,
  ProductPublicInfo,
} from '~/models'
import * as mocks from '~/utils/mocks'

export const meta: MetaFunction = () => {
  return [
    { title: 'Cart' },
    { name: 'description', content: 'Test product promotion' },
  ]
}

export const loader = async () => {
  const productModel = new ProductModel()
  return json({
    categories: await mocks.getCategories(),
    storeSettings: await mocks.getStoreInfo(),
    items: await mocks.getCart(),
    suggestedProducts: await mocks.getMockProducts(),
    shippingFee: '9.9',
  })
}

export default function Index() {
  const { categories, storeSettings, items, suggestedProducts, shippingFee } =
    useLoaderData<typeof loader>()
  return (
    <Cart
      categories={categories as CategoryItem[]}
      items={items as CartItemInfo[]}
      storeSettings={storeSettings as StoreSettings}
      suggestedProducts={suggestedProducts as ProductPublicInfo[]}
      shippingFee={shippingFee}
      allowVoucher={true}
      allowGuestCheckout={true}
    />
  )
}
