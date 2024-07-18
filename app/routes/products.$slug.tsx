import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Suspense } from 'react'
import { Installer, StoreConfig } from '~/models'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import ProductDetail from '~/themes/default/pages/storefront/ProductDetail'
import { FatalErrorTypes } from '~/types'
import { StoreNotInstalledError } from '~/utils/exception'
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
        product: await mocks.getMockProductById(
          request.url.split('/').at(-1) as string,
        ),
      },
    })
  } catch (e) {
    console.error(e) // TODO: replace this with a proper logger
    if (e instanceof StoreNotInstalledError) {
      return redirect('/install')
    } else if (e?.code === FatalErrorTypes.DatabaseConnection) {
      return redirect('/error')
    }

    return json({
      error: e,
      data: null,
    })
  }
}

export default function Index() {
  const { error, data } = useLoaderData<typeof loader>()

  return (
    <Suspense fallback={<Skeleton />}>
      <ProductDetail
        product={data?.product}
        storeSettings={data?.storeSettings}
        categories={data?.categories}
        publicPages={data?.publicPages}
      />
    </Suspense>
  )
}
