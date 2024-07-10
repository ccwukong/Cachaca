import type { MetaFunction } from '@remix-run/node'
import Dashboard from '~/themes/default/pages/admin/Dashboard'
import { json, redirect, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { cookie } from '~/cookie'
import { isValid, decode, encode } from '~/utils/jwt'

export const meta: MetaFunction = () => {
  return [{ title: 'Admin Dashboard' }]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieStr = request.headers.get('Cookie') || ''
  const { accessToken, refreshToken } = await cookie.parse(cookieStr)

  if (!(await isValid(accessToken))) {
    if (!(await isValid(refreshToken))) {
      return redirect('/admin/login')
    } else {
      const data = await decode(refreshToken)

      const [newAccessToken, newRefreshToken] = await encode(
        data as {
          id: string
          firstName: string
          lastName: string
          email: string
        },
      )

      return redirect('/admin', {
        headers: {
          'Set-Cookie': await cookie.serialize({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          }),
        },
      })
    }
  } else {
    return json({})
  }
}

export default function Index() {
  // const { error } = useLoaderData<typeof loader>()
  return <Dashboard />
}
