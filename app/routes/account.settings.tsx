import type { MetaFunction } from '@remix-run/node'
import Settings from '~/themes/default/pages/account/Settings'

export const meta: MetaFunction = () => {
  return [{ title: 'My Account - Settings' }]
}

export default function Index() {
  return <Settings storeLogo="" storeName="Cachaca" />
}
