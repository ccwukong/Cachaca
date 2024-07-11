import type { MetaFunction } from '@remix-run/node'
import Dashboard from '~/themes/default/pages/admin/Dashboard'
import { json, redirect, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { cookie } from '~/cookie'
import { isValid, decode, encode } from '~/utils/jwt'
import { ServerInternalError } from '~/utils/exception'
import { Installer } from '~/models'

export const meta: MetaFunction = () => {
  return [{ title: 'Admin Dashboard' }]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    if (!(await Installer.isInstalled())) {
      return redirect('/install')
    }

    const cookieStr = request.headers.get('Cookie') || ''
    if (!cookieStr) {
      return redirect('/admin/login')
    }

    const { accessToken, refreshToken } = await cookie.parse(cookieStr)

    if (!process.env.JWT_TOKEN_SECRET) {
      throw new ServerInternalError('Invalid JWT Token secret string.')
    }

    if (!(await isValid(accessToken, process.env.JWT_TOKEN_SECRET))) {
      if (!(await isValid(refreshToken, process.env.JWT_TOKEN_SECRET))) {
        return redirect('/admin/login')
      } else {
        const data = (await decode(
          refreshToken,
          process.env.JWT_TOKEN_SECRET!,
        )) as {
          id: string
          firstName: string
          lastName: string
          email: string
        }

        const newAccessToken = await encode(
          '1h',
          {
            id: data.id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
          },
          process.env.JWT_TOKEN_SECRET,
        )

        const newRefreshToken = await encode(
          '7d',
          {
            id: data.id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
          },
          process.env.JWT_TOKEN_SECRET,
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
  } catch (e) {
    return json({})
  }
}

export default function Index() {
  // const { error } = useLoaderData<typeof loader>()
  return (
    <Dashboard
      navLinks={[
        { title: 'Overview', url: '/admin', order: 1 },
        { title: 'Customers', url: '/admin/customers', order: 2 },
        { title: 'Orders', url: '/admin/orders', order: 3 },
        { title: 'Products', url: '/admin/products', order: 4 },
        { title: 'Settings', url: '/admin/settings', order: 5 },
      ]}
    />
  )
}
