import type { MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { json } from '@remix-run/node'
import Home from '~/themes/default/pages/account/Home'
import * as mocks from '~/utils/mocks'

export const meta: MetaFunction = () => {
  return [{ title: 'My orders' }, { name: 'description', content: 'My orders' }]
}

export const loader = async () => {
  return json({
    orders: await mocks.getOrders(),
  })
}

export default function Index() {
  const { orders } = useLoaderData<typeof loader>()
  return <Home storeLogo="" storeName="Cachaca" orders={orders} />
}
