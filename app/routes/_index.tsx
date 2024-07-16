import type { MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Suspense } from 'react'
import { Installer, StoreConfig } from '~/models'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import Home from '~/themes/default/pages/storefront/Home'
import { StoreNotInstalledError } from '~/utils/exception'
import * as mocks from '~/utils/mocks'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.data?.storeSettings.name },
    { name: 'description', content: data?.data?.storeSettings.description },
  ]
}

export const loader = async () => {
  try {
    if (!(await Installer.isInstalled())) {
      throw new StoreNotInstalledError()
    }

    return json({
      error: null,
      data: {
        categories: await mocks.getCategories(),
        storeSettings: await mocks.getStoreInfo(),
        products: await mocks.getMockProducts(),
        banners: await mocks.getHomeBanners(),
        publicPages: await StoreConfig.getPublicPages(),
      },
    })
  } catch (e) {
    console.log(123456, e)
    if (e instanceof StoreNotInstalledError) {
      return redirect('/install')
    }

    return json({ error: e, data: null })
  }
}

export default function Index() {
  const {
    data: { categories, storeSettings, products, banners, publicPages },
  } = useLoaderData<typeof loader>()

  return (
    <Suspense fallback={<Skeleton />}>
      <Home
        categories={categories}
        products={products}
        banners={banners}
        storeSettings={storeSettings}
        publicPages={publicPages || []}
      />
    </Suspense>
  )
}
