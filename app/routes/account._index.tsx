import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Installer } from '~/models'
import Home from '~/themes/default/pages/account/Home'
import { OrderItem } from '~/types'
import * as mocks from '~/utils/mocks'

export const meta: MetaFunction = () => {
  return [{ title: 'My Acccount - Orders' }]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (!(await Installer.isInstalled())) {
    return redirect('/install')
  }

  const cookieStr = request.headers.get('Cookie') || ''
  if (!cookieStr) {
    return redirect('/login')
  }

  return json({
    orders: (await mocks.getOrders()) as OrderItem[],
  })
}

export default function Index() {
  const { orders } = useLoaderData<typeof loader>()
  return <Home storeLogo="" storeName="Cachaca" orders={orders} />
}
