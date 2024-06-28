import type { MetaFunction } from '@remix-run/node'
import Register from '~/themes/default/pages/account/Register'

export const meta: MetaFunction = () => {
  return [{ title: 'Login' }, { name: 'description', content: 'Login' }]
}

export default function Index() {
  return <Register />
}
