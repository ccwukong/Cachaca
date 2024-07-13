import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { cookie } from '~/cookie'
import { Installer } from '~/models'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import Home from '~/themes/default/pages/account/Home'
import { OrderItem, Role } from '~/types'
import { ServerInternalError } from '~/utils/exception'
import { decode, encode, isValid } from '~/utils/jwt'
import * as mocks from '~/utils/mocks'

export const meta: MetaFunction = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation()
  return [{ title: t('system.account_dashboard') }]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    if (!(await Installer.isInstalled())) {
      return redirect('/install')
    }

    const cookieStr = request.headers.get('Cookie') || ''
    if (!cookieStr) {
      return redirect('/login')
    }

    const { accessToken, refreshToken } = await cookie.parse(cookieStr)

    if (!process.env.JWT_TOKEN_SECRET) {
      throw new ServerInternalError('Invalid JWT Token secret string.')
    }

    if (!(await isValid(accessToken, process.env.JWT_TOKEN_SECRET))) {
      if (!(await isValid(refreshToken, process.env.JWT_TOKEN_SECRET))) {
        return redirect('/login')
      } else {
        const payload = (await decode(
          refreshToken,
          process.env.JWT_TOKEN_SECRET!,
        )) as {
          id: string
          firstName: string
          lastName: string
          email: string
          role: Role.Customer
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

        return redirect('/account', {
          headers: {
            'Set-Cookie': await cookie.serialize({
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            }),
          },
        })
      }
    } else {
      return json({
        orders: (await mocks.getOrders()) as OrderItem[],
      })
    }
  } catch (e) {
    if (e instanceof TypeError) {
      return redirect('/login')
    } else {
      return json({ successful: false })
    }
  }
}

export default function Index() {
  const { orders } = useLoaderData<typeof loader>()
  return (
    <Suspense fallback={<Skeleton />}>
      <Home storeLogo="" storeName="Cachaca" orders={orders} />
    </Suspense>
  )
}
