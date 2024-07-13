import type { MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Suspense } from 'react'
import { Installer } from '~/models'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import Cart from '~/themes/default/pages/storefront/Cart'
import { CategoryItem, ProductPublicInfo, StoreSettings } from '~/types'
import * as mocks from '~/utils/mocks'

export const meta: MetaFunction = () => {
  return [
    { title: 'Cart' },
    { name: 'description', content: 'Test product promotion' },
  ]
}

export const loader = async () => {
  if (!(await Installer.isInstalled())) {
    return redirect('/install')
  }

  return json({
    categories: await mocks.getCategories(),
    storeSettings: await mocks.getStoreInfo(),
    suggestedProducts: await mocks.getMockProducts(),
    shippingFee: '9.9',
  })
}

export default function Index() {
  const { categories, storeSettings, suggestedProducts, shippingFee } =
    useLoaderData<typeof loader>()
  return (
    <Suspense fallback={<Skeleton />}>
      <Cart
        categories={categories as CategoryItem[]}
        storeSettings={storeSettings as StoreSettings}
        suggestedProducts={suggestedProducts as ProductPublicInfo[]}
        shippingFee={shippingFee}
        allowVoucher={true}
        allowGuestCheckout={true}
      />
    </Suspense>
  )
}
