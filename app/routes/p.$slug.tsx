import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Suspense } from 'react'
import { Installer, PublicInfo } from '~/models'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import Page from '~/themes/default/pages/storefront/Page'
import { NotFoundException, StoreNotInstalledError } from '~/utils/exception'
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

export const loader = async ({ params }: LoaderFunctionArgs) => {
  try {
    if (!(await Installer.isInstalled())) {
      throw new StoreNotInstalledError()
    }
    const publicPages = await PublicInfo.getPublicPages()
    const page = publicPages.filter(
      (item) => item.name.toLowerCase() === (params.slug || '').toLowerCase(),
    )
    if (!page.length) {
      throw new NotFoundException()
    }

    return json({
      error: null,
      data: {
        categories: await mocks.getCategories(),
        storeSettings: await mocks.getStoreInfo(),
        page: page[0],
        publicPages,
      },
    })
  } catch (e) {
    if (e instanceof StoreNotInstalledError) {
      return redirect('/install')
    } else if (e instanceof NotFoundException) {
      throw new Response(null, {
        status: 404,
        statusText: 'Not Found',
      })
    }
    return json({
      error: e,
      data: null,
    })
  }
}

export default function Index() {
  const {
    data: { categories, storeSettings, page, publicPages },
  } = useLoaderData<typeof loader>()

  return (
    <Suspense fallback={<Skeleton />}>
      <Page
        categories={categories}
        storeSettings={storeSettings}
        content={page}
        publicPages={publicPages || []}
      />
    </Suspense>
  )
}
