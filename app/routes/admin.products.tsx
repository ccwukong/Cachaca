import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { isValid } from '~/utils/jwt'
import { adminCookie } from '~/cookie'
import ProductList from '~/themes/default/pages/admin/ProductList'
import { ProductPublicInfo, StoreSettings } from '~/types'
import { ServerInternalError } from '~/utils/exception'
import * as mocks from '~/utils/mocks'

export const meta: MetaFunction = () => {
  return [{ title: 'Admin Dashboard - Products' }]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieStr = request.headers.get('Cookie') || ''
  if (!cookieStr) {
    return redirect('/admin/login')
  }

  const { accessToken } = await adminCookie.parse(cookieStr)

  if (!process.env.JWT_TOKEN_SECRET) {
    throw new ServerInternalError('Invalid JWT Token secret string.')
  }

  if (!(await isValid(accessToken, process.env.JWT_TOKEN_SECRET))) {
    return redirect('/admin')
  } else {
    return json({
      categories: await mocks.getCategories(),
      storeSettings: await mocks.getStoreInfo(),
      items: await mocks.getCart(),
      suggestedProducts: await mocks.getMockProducts(),
      shippingFee: '9.9',
    })
  }
}

export default function Index() {
  const { storeSettings, suggestedProducts } = useLoaderData<typeof loader>()
  return (
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
  )
}
