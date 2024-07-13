import type { MetaFunction } from '@remix-run/node'
import { json, LoaderFunctionArgs, redirect } from '@remix-run/node'
import { useTranslation } from 'react-i18next'
import { adminCookie } from '~/cookie'
import { Installer } from '~/models'
import Dashboard from '~/themes/default/pages/admin/Dashboard'
import { Role } from '~/types'
import { ServerInternalError } from '~/utils/exception'
import { decode, encode, isValid } from '~/utils/jwt'

export const meta: MetaFunction = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation()
  return [{ title: t('system.admin_dashboard') }]
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

    const { accessToken, refreshToken } = await adminCookie.parse(cookieStr)

    if (!process.env.JWT_TOKEN_SECRET) {
      throw new ServerInternalError('Invalid JWT Token secret string.')
    }

    if (!(await isValid(accessToken, process.env.JWT_TOKEN_SECRET))) {
      if (!(await isValid(refreshToken, process.env.JWT_TOKEN_SECRET))) {
        return redirect('/admin/login')
      } else {
        const payload = (await decode(
          refreshToken,
          process.env.JWT_TOKEN_SECRET!,
        )) as {
          id: string
          firstName: string
          lastName: string
          email: string
          role: Role.Admin
        }

        const data = {
          id: payload.id,
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          role: payload.role,
        }

        const newAccessToken = await encode(
          '1h',
          data,
          process.env.JWT_TOKEN_SECRET,
        )

        const newRefreshToken = await encode(
          '7d',
          data,
          process.env.JWT_TOKEN_SECRET,
        )

        return redirect('/admin', {
          headers: {
            'Set-Cookie': await adminCookie.serialize({
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            }),
          },
        })
      }
    } else {
      return json({ successful: false })
    }
  } catch (e) {
    if (e instanceof TypeError) {
      return redirect('/admin/login')
    } else {
      return json({ successful: false })
    }
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
