import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Suspense } from 'react'
import { Installer, StoreConfig } from '~/models'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import CategoryProductList from '~/themes/default/pages/storefront/CategoryProductList'
import { FatalErrorTypes } from '~/types'
import { StoreNotInstalledError } from '~/utils/exception'
import * as mocks from '~/utils/mocks'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.categoryName },
    { name: 'description', content: data?.categoryName },
  ]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    if (!(await Installer.isInstalled())) {
      throw new StoreNotInstalledError()
    }

    return json({
      error: null,
      data: {
        categories: await mocks.getCategories(),
        storeSettings: await mocks.getStoreInfo(),
        publicPages: await StoreConfig.getPublicPages(),
        products: await mocks.getMockProducts(),
        categoryName: (await mocks.getCategories()).find(
          (item) => item.slug === (request.url.split('/').at(-1) || ''),
        )?.name,
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
  const { error, data } = useLoaderData<typeof loader>()

  return (
    <Suspense fallback={<Skeleton />}>
      <CategoryProductList
        categories={data?.categories}
        products={data?.products}
        publicPages={data?.publicPages}
        storeSettings={data?.storeSettings}
        category={data?.categoryName || ''}
      />
    </Suspense>
  )
}
