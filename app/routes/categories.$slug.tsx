import type { MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import CategoryProductList from '~/themes/default/pages/shop/CategoryProductList'
import { PublicInfo, ProductModel } from '~/model'

export const meta: MetaFunction = () => {
  return [
    { title: 'Product 123' },
    { name: 'description', content: 'Test product promotion' },
  ]
}

export const loader = async () => {
  const model = new ProductModel()
  return json({
    storeSettings: await PublicInfo.getStoreInfo(),
    products: await model.findMany(1, 20),
  })
}

export default function Index() {
  const { storeSettings, products } = useLoaderData<typeof loader>()
  return (
    <CategoryProductList products={products} storeSettings={storeSettings} />
  )
}
