import type { MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Suspense } from 'react'
import StoreContext from '~/contexts/storeContext'
import { Installer, StoreConfig } from '~/models'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import Home from '~/themes/default/pages/storefront/Home'
import { CategoryItem, FatalErrorTypes, ProductPublicInfo } from '~/types'
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
        storeSettings: await StoreConfig.getStoreInfo(),
        products: await mocks.getMockProducts(),
      },
    })
  } catch (e) {
    console.error(e) // TODO: replace this with a proper logger
    if (e instanceof StoreNotInstalledError) {
      return redirect('/install')
    } else if (e?.code === FatalErrorTypes.DatabaseConnection) {
      return redirect('/error')
    }

    return json({ error: e, data: null })
  }
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>()

  return (
    <Suspense fallback={<Skeleton />}>
      <StoreContext.Provider
        value={{
          storeSettings: loaderData!.data!.storeSettings,
          categories: loaderData!.data!.categories as CategoryItem[],
        }}
      >
        <Home products={loaderData!.data!.products as ProductPublicInfo[]} />
      </StoreContext.Provider>
    </Suspense>
  )
}
