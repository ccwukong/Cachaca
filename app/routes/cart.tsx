import type { MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Suspense } from 'react'
import { Installer } from '~/models'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import Cart from '~/themes/default/pages/storefront/Cart'
import { StoreNotInstalledError } from '~/utils/exception'
import * as mocks from '~/utils/mocks'

export const meta: MetaFunction = () => {
  return [{ title: 'Cart' }]
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
        suggestedProducts: await mocks.getMockProducts(),
        shippingFee: '9.9',
      },
    })
  } catch (e) {
    if (e instanceof StoreNotInstalledError) {
      return redirect('/install')
    }

    return json({ error: e, data: {} })
  }
}

export default function Index() {
  const { error, data } = useLoaderData<typeof loader>()
  return (
    <Suspense fallback={<Skeleton />}>
      <Cart
        categories={data.categories}
        storeSettings={data.storeSettings}
        suggestedProducts={data.suggestedProducts}
        shippingFee={data.shippingFee}
        allowVoucher={true}
        allowGuestCheckout={true}
      />
    </Suspense>
  )
}
