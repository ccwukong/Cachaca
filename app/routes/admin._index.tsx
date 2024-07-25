import type { MetaFunction } from '@remix-run/node'
import { json, LoaderFunctionArgs, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import AdminContext from '~/contexts/adminContext'
import { adminCookie } from '~/cookie'
import { Installer, StoreConfig, UserModel } from '~/models'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import Dashboard from '~/themes/default/pages/admin/Dashboard'
import { FatalErrorTypes, Role } from '~/types'
import {
  JWTTokenSecretNotFoundException,
  StoreNotInstalledError,
  UnAuthenticatedException,
} from '~/utils/exception'
import { decode, encode, isValid } from '~/utils/jwt'

export const meta: MetaFunction = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation()
  return [{ title: t('system.admin_dashboard') }]
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

    const { accessToken, refreshToken } = await adminCookie.parse(cookieStr)

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
      const payload = (await decode(
        accessToken,
        process.env.JWT_TOKEN_SECRET,
      )) as {
        id: string
        firstName: string
        lastName: string
        email: string
      }

      const account = await new UserModel().find(payload.id)
      return json({
        error: null,
        data: { storeSettings: await StoreConfig.getStoreInfo(), account },
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
      return redirect('/admin/login')
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
  const { t } = useTranslation()

  return (
    <Suspense fallback={<Skeleton />}>
      <AdminContext.Provider
        value={{
          navItems: [
            { title: t('system.overview'), url: '/admin', order: 1 },
            { title: t('system.customers'), url: '/admin/customers', order: 2 },
            { title: t('system.orders'), url: '/admin/orders', order: 3 },
            { title: t('system.products'), url: '/admin/products', order: 4 },
            {
              title: t('system.store_members'),
              url: '/admin/members',
              order: 5,
            },
            { title: t('system.settings'), url: '/admin/settings', order: 6 },
          ],
          account: loaderData!.data!.account,
          storeSettings: loaderData!.data!.storeSettings,
        }}
      >
        <Dashboard />
      </AdminContext.Provider>
    </Suspense>
  )
}
