import type { MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import Home from '~/themes/default/pages/shop/Home'
import { ProductModel, SiteSettings } from '~/model'

export const meta: MetaFunction = () => {
  return [
    { title: 'Cachaca' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export const loader = async () => {
  const productModel = new ProductModel()
  return json({
    products: await productModel.findMany(1, 20),
    banners: await SiteSettings.getHomeBanners(),
  })
}

export default function Index() {
  const { products, banners } = useLoaderData<typeof loader>()
  return <Home products={products} banners={banners} />
}
