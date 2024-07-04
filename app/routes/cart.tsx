import type { MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import Cart from '~/themes/default/pages/shop/Cart'
import { PublicInfo, ProductModel } from '~/models'
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
    storeSettings: await mocks.getStoreInfo(),
    items: await mocks.getCart(),
    suggestedProducts: await mocks.getMockProducts(),
  })
}

export default function Index() {
  const { storeSettings, items, suggestedProducts } =
    useLoaderData<typeof loader>()
  return (
    <Cart
      items={items}
      storeSettings={storeSettings}
      suggestedProducts={suggestedProducts}
    />
  )
}
