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
import { CustomerModel, StoreConfig, UserModel } from '~/models'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import CustomerList from '~/themes/default/pages/admin/CustomerList'
import { FatalErrorTypes } from '~/types'
import {
  JWTTokenSecretNotFoundException,
  UnAuthenticatedException,
} from '~/utils/exception'
import { decode, isValid } from '~/utils/jwt'

export const meta: MetaFunction = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation()
  return [{ title: t('system.admin_dashboard_customers') }]
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
      const page = new URL(request.url).searchParams.get('page') || '1'
      const size = new URL(request.url).searchParams.get('size') || '20'
      const customers = await new CustomerModel().findMany(
        Number(page) < 1 ? 0 : Number(page) - 1,
        Number(size) < 1 ? 1 : Number(size),
      )

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
          storeSettings: await StoreConfig.getStoreInfo(),
          customers,
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

  return loaderData.data ? (
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
          account: loaderData.data.account,
          storeSettings: loaderData.data.storeSettings,
        }}
      >
        <CustomerList customers={loaderData?.data?.customers || []} />
      </AdminContext.Provider>
    </Suspense>
  ) : (
    <Skeleton />
  )
}
