import {
  json,
  LoaderFunctionArgs,
  redirect,
  type MetaFunction,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import AdminContext from '~/contexts/adminContext'
import { adminCookie } from '~/cookie'
import { StoreConfig, UserModel } from '~/models'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import OrderList from '~/themes/default/pages/admin/OrderList'
import { FatalErrorTypes, OrderItem } from '~/types'
import {
  JWTTokenSecretNotFoundException,
  UnAuthenticatedException,
} from '~/utils/exception'
import { decode, isValid } from '~/utils/jwt'
import * as mocks from '~/utils/mocks'

export const meta: MetaFunction = () => {
  return [{ title: 'Admin Dashboard - Orders' }]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    if (!process.env.JWT_TOKEN_SECRET) {
      throw new JWTTokenSecretNotFoundException()
    }

    const cookieStr = request.headers.get('Cookie') || ''
    if (!cookieStr) {
      throw new UnAuthenticatedException()
    }

    const { accessToken } = await adminCookie.parse(cookieStr)

    if (!(await isValid(accessToken, process.env.JWT_TOKEN_SECRET))) {
      throw new UnAuthenticatedException()
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
        data: {
          orders: (await mocks.getOrders()) as OrderItem[],
          storeSettings: await StoreConfig.getStoreInfo(),
          account,
        },
      })
    }
  } catch (e) {
    console.error(e) // TODO: replace this with a proper logger
    if (e instanceof JWTTokenSecretNotFoundException) {
      //TODO: handle this seperately
    } else if (e instanceof UnAuthenticatedException) {
      return redirect('/admin')
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
        <OrderList orders={loaderData!.data!.orders} />
      </AdminContext.Provider>
    </Suspense>
  )
}
