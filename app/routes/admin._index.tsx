import type { MetaFunction } from '@remix-run/node'
import Dashboard from '~/themes/default/pages/admin/Dashboard'
import { json, redirect, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getSession, commitSession } from '~/sessions'

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'))

  if (!session.has('userId')) {
    return redirect('/admin/login')
  }

  const data = { error: session.get('error') }

  return json(data, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}

export const meta: MetaFunction = () => {
  return [
    { title: 'Admin Dashboard' },
    { name: 'description', content: 'Admin Dashboard' },
  ]
}

export default function Index() {
  const { error } = useLoaderData<typeof loader>()
  return <Dashboard />
}
