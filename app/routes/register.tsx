import type { MetaFunction } from '@remix-run/node'
import Register from '~/themes/default/pages/Register'

export const meta: MetaFunction = () => {
  return [{ title: 'Login' }, { name: 'description', content: 'Login' }]
}

export default function Index() {
  return <Register />
}
