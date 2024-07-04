import type { MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import Home from '~/themes/default/pages/shop/Home'
import { ProductModel } from '~/models'
import * as mocks from '~/utils/mocks'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.storeSettings.name },
    { name: 'description', content: data?.storeSettings.description },
  ]
}

export const loader = async () => {
  const productModel = new ProductModel()
  return json({
    storeSettings: await mocks.getStoreInfo(),
    products: await mocks.getMockProducts(),
    banners: await mocks.getHomeBanners(),
  })
}

export default function Index() {
  const { storeSettings, products, banners } = useLoaderData<typeof loader>()
  return (
    <Home products={products} banners={banners} storeSettings={storeSettings} />
  )
}
