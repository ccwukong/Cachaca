import {
  json,
  LoaderFunctionArgs,
  redirect,
  type MetaFunction,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Suspense } from 'react'
import AdminContext from '~/contexts/adminContext'
import { adminCookie } from '~/cookie'
import { StoreConfig, UserModel } from '~/models'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import MemberList from '~/themes/default/pages/admin/MemberList'
import { FatalErrorTypes } from '~/types'
import {
  JWTTokenSecretNotFoundException,
  UnAuthenticatedException,
} from '~/utils/exception'
import { decode, isValid } from '~/utils/jwt'

export const meta: MetaFunction = () => {
  return [{ title: 'Admin Dashboard - Store members' }]
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
      const users = await new UserModel().findMany(
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
          users,
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
  return (
    <Suspense fallback={<Skeleton />}>
      <AdminContext.Provider
        value={{
          navItems: [
            { title: 'Overview', url: '/admin', order: 1 },
            { title: 'Customers', url: '/admin/customers', order: 2 },
            { title: 'Orders', url: '/admin/orders', order: 3 },
            { title: 'Products', url: '/admin/products', order: 4 },
            { title: 'Store members', url: '/admin/members', order: 5 },
            { title: 'Settings', url: '/admin/settings', order: 6 },
          ],
          account: loaderData!.data!.account,
          storeSettings: loaderData!.data!.storeSettings,
        }}
      >
        <MemberList users={loaderData?.data?.users || []} />
      </AdminContext.Provider>
    </Suspense>
  )
}
