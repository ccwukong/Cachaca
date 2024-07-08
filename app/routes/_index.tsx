import type { MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import fs from 'node:fs'
import path from 'node:path'
import { useLoaderData } from '@remix-run/react'
import Home from '~/themes/default/pages/storefront/Home'
import { ProductModel } from '~/models'
import * as mocks from '~/utils/mocks'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.storeSettings.name },
    { name: 'description', content: data?.storeSettings.description },
  ]
}

export const loader = async () => {
  if (fs.existsSync(path.join(path.resolve(), 'app', 'routes', 'setup.tsx'))) {
    return redirect('/setup')
  }
  
  return json({
    categories: await mocks.getCategories(),
    storeSettings: await mocks.getStoreInfo(),
    products: await mocks.getMockProducts(),
    banners: await mocks.getHomeBanners(),
  })
}

export default function Index() {
  const { categories, storeSettings, products, banners } =
    useLoaderData<typeof loader>()
  return (
    <Home
      categories={categories}
      products={products}
      banners={banners}
      storeSettings={storeSettings}
    />
  )
}
