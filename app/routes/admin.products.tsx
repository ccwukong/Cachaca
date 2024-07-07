import type { MetaFunction } from '@remix-run/node'
import ProductList from '~/themes/default/pages/admin/ProductList'

export const meta: MetaFunction = () => {
  return [{ title: 'Admin Dashboard - Products' }]
}

export default function Index() {
  return <ProductList />
}
