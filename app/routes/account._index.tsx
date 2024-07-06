import type { MetaFunction } from '@remix-run/node'
import Home from '~/themes/default/pages/account/Home'

export const meta: MetaFunction = () => {
  return [{ title: 'My orders' }, { name: 'description', content: 'My orders' }]
}

export default function Index() {
  return <Home storeLogo="" storeName="Cachaca" />
}
