import {
  json,
  LoaderFunctionArgs,
  redirect,
  type MetaFunction,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Suspense } from 'react'
import StoreContext from '~/contexts/storeContext'
import { Installer, ProductModel, StoreConfig } from '~/models'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import CategoryProductList from '~/themes/default/pages/storefront/CategoryProductList'
import { CategoryItem, FatalErrorTypes } from '~/types'
import { StoreNotInstalledError } from '~/utils/exception'
import * as mocks from '~/utils/mocks'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: `${data?.data?.storeSettings.name} - ${data?.data?.categoryName}`,
    },
    { name: 'HandheldFriendly', content: 'true' },
    { name: 'description', content: data?.data?.categoryName },
    { name: 'og:title', content: data?.data?.categoryName },
    { name: 'og:url', content: data?.data?.url },
    { name: 'og:description', content: data?.data?.categoryName },
    { name: 'og:site_name', content: data?.data?.storeSettings.name },
    { name: 'og:type', content: 'website' },
  ]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    if (!(await Installer.isInstalled())) {
      throw new StoreNotInstalledError()
    }
    const model = new ProductModel()
    return json({
      error: null,
      data: {
        categories: await mocks.getCategories(),
        storeSettings: await StoreConfig.getStoreInfo(),
        publicPages: await StoreConfig.getPublicPages(),
        products: await mocks.getMockProducts(),
        categoryName: (await mocks.getCategories()).find(
          (item) => item.slug === (request.url.split('/').at(-1) || ''),
        )?.name,
        url: new URL(request.url),
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
          publicPages: loaderData!.data!.publicPages,
        }}
      >
        <CategoryProductList
          products={loaderData!.data!.products}
          category={loaderData!.data!.categoryName}
        />
      </StoreContext.Provider>
    </Suspense>
  )
}
