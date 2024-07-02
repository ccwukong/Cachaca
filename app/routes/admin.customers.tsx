import type { MetaFunction } from '@remix-run/node'
import CustomerList from '~/themes/default/pages/admin/CustomerList'

export const meta: MetaFunction = () => {
  return [
    { title: 'Admin Dashboard' },
    { name: 'description', content: 'Admin Dashboard' },
  ]
}

export default function Index() {
  return <CustomerList />
}
