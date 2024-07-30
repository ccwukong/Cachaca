import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import CustomerContext from '~/contexts/customerContext'
import { cookie } from '~/cookie'
import { CustomerModel, Installer, StoreConfig } from '~/models'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import Home from '~/themes/default/pages/account/Home'
import { FatalErrorTypes, OrderItem, Role } from '~/types'
import {
  JWTTokenSecretNotFoundException,
  StoreNotInstalledError,
  UnAuthenticatedException,
} from '~/utils/exception'
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
      throw new StoreNotInstalledError()
    }

    if (!process.env.JWT_TOKEN_SECRET) {
      throw new JWTTokenSecretNotFoundException()
    }

    const cookieStr = request.headers.get('Cookie') || ''
    if (!cookieStr) {
      throw new UnAuthenticatedException()
    }

    const { accessToken, refreshToken } = await cookie.parse(cookieStr)

    if (!(await isValid(accessToken, process.env.JWT_TOKEN_SECRET))) {
      if (!(await isValid(refreshToken, process.env.JWT_TOKEN_SECRET))) {
        throw new UnAuthenticatedException()
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
      const payload = (await decode(
        accessToken,
        process.env.JWT_TOKEN_SECRET,
      )) as {
        id: string
        firstName: string
        lastName: string
        email: string
      }

      const account = await new CustomerModel().find(payload.id)

      return json({
        error: null,
        data: {
          orders: (await mocks.getOrders()) as OrderItem[],
          storeSettings: await StoreConfig.getStoreInfo(),
          account,
        },
      })
    }
  } catch (e) {
    console.error(e) // TODO: replace this with a proper logger
    if (e instanceof StoreNotInstalledError) {
      return redirect('/install')
    } else if (
      e instanceof UnAuthenticatedException ||
      e instanceof TypeError
    ) {
      return redirect('/login')
    } else if (e instanceof JWTTokenSecretNotFoundException) {
      // TODO: need to handle this seprately
    } else if (e?.code === FatalErrorTypes.DatabaseConnection) {
      return redirect('/error')
    }

    return json({ error: e, data: null })
  }
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>()

  return loaderData.data ? (
    <Suspense fallback={<Skeleton />}>
      <CustomerContext.Provider
        value={{
          account: loaderData.data.account,
          storeSettings: loaderData.data.storeSettings,
        }}
      >
        <Home orders={loaderData.data.orders} />
      </CustomerContext.Provider>
    </Suspense>
  ) : (
    <Skeleton />
  )
}
