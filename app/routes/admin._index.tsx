import type { MetaFunction } from '@remix-run/node'
import fs from 'node:fs'
import path from 'node:path'
import Dashboard from '~/themes/default/pages/admin/Dashboard'
import { json, redirect, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { cookie } from '~/cookie'

export async function loader({ request }: LoaderFunctionArgs) {
  // delete the installer files on production
  if ((process.env.NODE_ENV || '') !== 'development') {
    const installRoute = path.join(
      path.resolve(),
      'app',
      'routes',
      'install.tsx',
    )

    if (fs.existsSync(installRoute)) {s
      fs.unlinkSync(installRoute)
    }
  }
}

export const meta: MetaFunction = () => {
  return [{ title: 'Admin Dashboard' }]
}

export default function Index() {
  // const { error } = useLoaderData<typeof loader>()
  return <Dashboard />
}
