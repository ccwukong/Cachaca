import type { MetaFunction } from '@remix-run/node'
import Account from '~/themes/default/pages/Account'

export const meta: MetaFunction = () => {
  return [{ title: 'Account' }, { name: 'description', content: 'My account' }]
}

export default function Index() {
  return <Account />
}
