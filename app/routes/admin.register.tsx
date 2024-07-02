import type { MetaFunction } from '@remix-run/node'
import Register from '~/themes/default/pages/admin/Register'

export const meta: MetaFunction = () => {
  return [{ title: 'Register' }, { name: 'description', content: 'Register' }]
}

export default function Index() {
  return <Register />
}
