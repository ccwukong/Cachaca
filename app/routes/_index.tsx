import type { MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Suspense } from 'react'
import { Installer } from '~/models'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import Home from '~/themes/default/pages/storefront/Home'
import { StoreNotInstalledError } from '~/utils/exception'
import * as mocks from '~/utils/mocks'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.storeSettings.name },
    { name: 'description', content: data?.storeSettings.description },
  ]
}

export const loader = async () => {
  try {
    if (!(await Installer.isInstalled())) {
      throw new StoreNotInstalledError()
    }

    return json({
      categories: await mocks.getCategories(),
      storeSettings: await mocks.getStoreInfo(),
      products: await mocks.getMockProducts(),
      banners: await mocks.getHomeBanners(),
    })
  } catch (e) {
    if (e instanceof StoreNotInstalledError) {
      return redirect('/install')
    }

    return json({ error: e, data: null })
  }
}

export default function Index() {
  const { categories, storeSettings, products, banners } =
    useLoaderData<typeof loader>()

  return (
    <Suspense fallback={<Skeleton />}>
      <Home
        categories={categories}
        products={products}
        banners={banners}
        storeSettings={storeSettings}
      />
    </Suspense>
  )
}
