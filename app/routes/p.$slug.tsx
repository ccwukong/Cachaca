import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Suspense } from 'react'
import StoreContext from '~/contexts/storeContext'
import { Installer, StoreConfig } from '~/models'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import Page from '~/themes/default/pages/storefront/Page'
import { CategoryItem, FatalErrorTypes } from '~/types'
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
    const storeSettings = await StoreConfig.getStoreInfo()
    const page = storeSettings.publicPages.filter(
      (item) => item.slug.toLowerCase() === (params.slug || '').toLowerCase(),
    )
    if (!page.length) {
      throw new NotFoundException()
    }

    return json({
      error: null,
      data: {
        categories: await mocks.getCategories(),
        storeSettings,
        page: page[0],
      },
    })
  } catch (e) {
    console.error(e) // TODO: replace this with a proper logger
    if (e instanceof StoreNotInstalledError) {
      return redirect('/install')
    } else if (e instanceof NotFoundException) {
      throw new Response(null, {
        status: 404,
        statusText: 'Not Found',
      })
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
        <Page content={loaderData!.data!.page} />
      </StoreContext.Provider>
    </Suspense>
  )
}
