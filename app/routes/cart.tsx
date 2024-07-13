import type { MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { ProductModel } from '~/models'
import Cart from '~/themes/default/pages/storefront/Cart'
import { CategoryItem, ProductPublicInfo, StoreSettings } from '~/types'
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
    suggestedProducts: await mocks.getMockProducts(),
    shippingFee: '9.9',
  })
}

export default function Index() {
  const { categories, storeSettings, suggestedProducts, shippingFee } =
    useLoaderData<typeof loader>()
  return (
    <Cart
      categories={categories as CategoryItem[]}
      storeSettings={storeSettings as StoreSettings}
      suggestedProducts={suggestedProducts as ProductPublicInfo[]}
      shippingFee={shippingFee}
      allowVoucher={true}
      allowGuestCheckout={true}
    />
  )
}
