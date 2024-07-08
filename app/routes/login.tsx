import type { MetaFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import fs from 'node:fs'
import path from 'node:path'
import Login from '~/themes/default/pages/account/Login'

export const meta: MetaFunction = () => {
  return [{ title: 'Login' }, { name: 'description', content: 'Login' }]
}

export const loader = async () => {
  if (fs.existsSync(path.join(path.resolve(), 'app', 'routes', 'setup.tsx'))) {
    return redirect('/setup')
  }
}

export default function Index() {
  return <Login />
}
