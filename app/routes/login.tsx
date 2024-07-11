import type { MetaFunction, ActionFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import Login from '~/themes/default/pages/account/Login'

export const meta: MetaFunction = () => {
  return [{ title: 'Login' }]
}

export default function Index() {
  return <Login />
}
