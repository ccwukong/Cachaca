import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import ProductDetail from '~/themes/default/pages/shop/ProductDetail'
import { ProductModel } from '~/models'
import * as mocks from '~/utils/mocks'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  let desc = ''
  let counter = 0
  const len = 200
  let fullDesc = data?.product?.description || ''
  for (const w of data?.product?.description || '') {
    if (counter === len) {
      break
    }
    desc += w
    counter++
  }

  if (fullDesc.length > len) {
    fullDesc = fullDesc.slice(len)
    desc += fullDesc.split(' ')[0] + ' ...`'
  }

  return [
    { title: data?.product?.name || '' },
    {
      name: 'description',
      content: desc,
    },
  ]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const model = new ProductModel()
  return json({
    categories: await mocks.getCategories(),
    storeSettings: await mocks.getStoreInfo(),
    product: await mocks.getMockProductById(
      request.url.split('/').at(-1) as string,
    ),
  })
}

export default function Index() {
  const { categories, storeSettings, product } = useLoaderData<typeof loader>()

  return (
    <ProductDetail
      product={product}
      storeSettings={storeSettings}
      categories={categories}
    />
  )
}
