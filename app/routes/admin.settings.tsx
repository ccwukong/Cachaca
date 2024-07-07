import type { MetaFunction } from '@remix-run/node'
import Settings from '~/themes/default/pages/admin/Settings'

export const meta: MetaFunction = () => {
  return [{ title: 'Admin Dashboard - Settings' }]
}

export default function Index() {
  return <Settings />
}
