import type { MetaFunction } from '@remix-run/node'
import Register from '~/themes/default/pages/admin/Register'

export const meta: MetaFunction = () => {
  return [{ title: 'Admin - Create new account' }]
}

export default function Index() {
  return <Register />
}
