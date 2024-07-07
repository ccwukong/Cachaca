import type { MetaFunction } from '@remix-run/node'
import MemberList from '~/themes/default/pages/admin/MemberList'

export const meta: MetaFunction = () => {
  return [{ title: 'Admin Dashboard - Store members' }]
}

export default function Index() {
  return <MemberList />
}
