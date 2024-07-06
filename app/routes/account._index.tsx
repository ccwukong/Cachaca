import type { MetaFunction } from '@remix-run/node'
import Account from '~/themes/default/pages/account/Account'

export const meta: MetaFunction = () => {
  return [{ title: 'My orders' }, { name: 'description', content: 'My orders' }]
}

export default function Index() {
  return <Account storeLogo="" storeName="Cachaca" />
}
