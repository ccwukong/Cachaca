import type { MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { ProductModel } from '~/models'
import ProductList from '~/themes/default/pages/admin/ProductList'
import { ProductPublicInfo, StoreSettings } from '~/types'
import * as mocks from '~/utils/mocks'

export const meta: MetaFunction = () => {
  return [{ title: 'Admin Dashboard - Products' }]
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
  const { storeSettings, suggestedProducts } = useLoaderData<typeof loader>()
  return (
    <ProductList
      navLinks={[
        { title: 'Overview', url: '/admin', order: 1 },
        { title: 'Customers', url: '/admin/customers', order: 2 },
        { title: 'Orders', url: '/admin/orders', order: 3 },
        { title: 'Products', url: '/admin/products', order: 4 },
        { title: 'Settings', url: '/admin/settings', order: 5 },
      ]}
      products={suggestedProducts as ProductPublicInfo[]}
      storeSettings={storeSettings as StoreSettings}
    />
  )
}
