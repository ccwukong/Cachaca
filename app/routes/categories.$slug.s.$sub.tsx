import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Installer } from '~/models'
import CategoryProductList from '~/themes/default/pages/storefront/CategoryProductList'
import * as mocks from '~/utils/mocks'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.categoryName },
    { name: 'description', content: data?.categoryName },
  ]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (!(await Installer.isInstalled())) {
    return redirect('/install')
  }
  return json({
    categories: await mocks.getCategories(),
    storeSettings: await mocks.getStoreInfo(),
    products: await mocks.getMockProducts(),
    categoryName: (await mocks.getCategories()).find(
      (item) => item.slug === (request.url.split('/').at(-1) || ''),
    )?.name,
  })
}

export default function Index() {
  const { categoryName, categories, storeSettings, products } =
    useLoaderData<typeof loader>()

  return (
    <CategoryProductList
      categories={categories}
      products={products}
      storeSettings={storeSettings}
      category={categoryName || ''}
    />
  )
}
