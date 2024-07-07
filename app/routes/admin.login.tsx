import type { MetaFunction } from '@remix-run/node'
import Login from '~/themes/default/pages/admin/Login'

export const meta: MetaFunction = () => {
  return [{ title: 'Admin Login' }]
}

export default function Index() {
  return <Login />
}
