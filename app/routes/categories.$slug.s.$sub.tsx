import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import CategoryProductList from '~/themes/default/pages/storefront/CategoryProductList'
import { ProductModel } from '~/models'
import * as mocks from '~/utils/mocks'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.categoryName },
    { name: 'description', content: data?.categoryName },
  ]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const model = new ProductModel()
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
