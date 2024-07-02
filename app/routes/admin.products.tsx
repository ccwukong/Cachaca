import type { MetaFunction } from '@remix-run/node'
import Dashboard from '~/themes/default/pages/admin/Dashboard'

export const meta: MetaFunction = () => {
  return [
    { title: 'Admin Dashboard' },
    { name: 'description', content: 'Admin Dashboard' },
  ]
}

export default function Index() {
  return <Dashboard />
}
