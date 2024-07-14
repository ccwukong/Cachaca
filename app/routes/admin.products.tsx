import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Suspense } from 'react'
import { adminCookie } from '~/cookie'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import ProductList from '~/themes/default/pages/admin/ProductList'
import { ProductPublicInfo, StoreSettings } from '~/types'
import {
  JWTTokenSecretNotFoundException,
  UnAuthenticatedException,
} from '~/utils/exception'
import { isValid } from '~/utils/jwt'
import * as mocks from '~/utils/mocks'

export const meta: MetaFunction = () => {
  return [{ title: 'Admin Dashboard - Products' }]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    if (!process.env.JWT_TOKEN_SECRET) {
      throw new JWTTokenSecretNotFoundException()
    }

    const cookieStr = request.headers.get('Cookie') || ''
    if (!cookieStr) {
      throw new UnAuthenticatedException()
    }

    const { accessToken } = await adminCookie.parse(cookieStr)

    if (!(await isValid(accessToken, process.env.JWT_TOKEN_SECRET))) {
      throw new UnAuthenticatedException()
    } else {
      return json({
        error: null,
        data: {
          categories: await mocks.getCategories(),
          storeSettings: await mocks.getStoreInfo(),
          items: await mocks.getCart(),
          suggestedProducts: await mocks.getMockProducts(),
          shippingFee: '9.9',
        },
      })
    }
  } catch (e) {
    if (e instanceof JWTTokenSecretNotFoundException) {
      //TODO: handle this seperately
    } else if (e instanceof UnAuthenticatedException) {
      return redirect('/admin')
    }

    return json({ error: e, data: null })
  }
}

export default function Index() {
  const { storeSettings, suggestedProducts } = useLoaderData<typeof loader>()
  return (
    <Suspense fallback={<Skeleton />}>
      <ProductList
        navLinks={[
          { title: 'Overview', url: '/admin', order: 1 },
          { title: 'Customers', url: '/admin/customers', order: 2 },
          { title: 'Orders', url: '/admin/orders', order: 3 },
          { title: 'Products', url: '/admin/products', order: 4 },
          { title: 'Settings', url: '/admin/settings', order: 5 },
        ]}
        products={suggestedProducts as ProductPublicInfo[]}
        storeSettings={storeSettings as StoreSettings}
      />
    </Suspense>
  )
}
