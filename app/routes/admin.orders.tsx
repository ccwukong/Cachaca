import type { MetaFunction } from '@remix-run/node'
import OrderList from '~/themes/default/pages/admin/OrderList'

export const meta: MetaFunction = () => {
  return [{ title: 'Admin Dashboard - Orders' }]
}

export default function Index() {
  return <OrderList />
}
