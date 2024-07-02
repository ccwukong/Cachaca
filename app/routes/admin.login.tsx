import type { MetaFunction } from '@remix-run/node'
import Login from '~/themes/default/pages/admin/Login'

export const meta: MetaFunction = () => {
  return [{ title: 'Login' }, { name: 'description', content: 'Login' }]
}

export default function Index() {
  return <Login />
}
