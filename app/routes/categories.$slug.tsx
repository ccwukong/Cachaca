import type { MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import CategoryProductList from '~/themes/default/pages/shop/CategoryProductList'
import { PublicInfo, ProductModel } from '~/models'
import * as mocks from '~/utils/mocks'

export const meta: MetaFunction = () => {
  return [
    { title: 'Product 123' },
    { name: 'description', content: 'Test product promotion' },
  ]
}

export const loader = async () => {
  const model = new ProductModel()
  return json({
    categories: await mocks.getCategories(),
    storeSettings: await mocks.getStoreInfo(),
    products: await mocks.getMockProducts(),
  })
}

export default function Index() {
  const { categories, storeSettings, products } = useLoaderData<typeof loader>()
  return (
    <CategoryProductList
      categories={categories}
      products={products}
      storeSettings={storeSettings}
    />
  )
}
