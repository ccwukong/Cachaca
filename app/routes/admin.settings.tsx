import {
  ActionFunctionArgs,
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
import Settings from '~/themes/default/pages/admin/Settings'
import { AddressType, FatalErrorTypes } from '~/types'
import {
  JWTTokenSecretNotFoundException,
  UnAuthenticatedException,
} from '~/utils/exception'
import { decode, isValid } from '~/utils/jwt'

export const meta: MetaFunction = () => {
  return [{ title: 'Admin Dashboard - Settings' }]
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
        data: { storeSettings: await StoreConfig.getStoreInfo(), account },
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

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const body = await request.formData()
    if (
      body.get('intent') === 'store-info' ||
      body.get('intent') === 'api-info'
    ) {
      await StoreConfig.updateStoreInfo({
        name: String(body.get('store-name')),
        description: String(body.get('store-description')),
        address: {
          id: '',
          address: String(body.get('store-address')),
          city: String(body.get('store-city')),
          state: String(body.get('store-state')),
          zipcode: String(body.get('store-zipcode')),
          country: String(body.get('store-country')),
          type: AddressType.Store,
        },
        phone: String(body.get('store-phone')),
        email: String(body.get('store-email')),
        logo: String(body.get('store-logo')),
        banners: JSON.parse(String(body.get('banners'))),
        other: JSON.parse(String(body.get('other'))),
      })
    } else if (body.get('intent') === 'account-info') {
      await StoreConfig.updateStoreInfo({
        name: String(body.get('store-name')),
        description: String(body.get('store-description')),
        address: {
          id: '',
          address: String(body.get('store-address')),
          city: String(body.get('store-city')),
          state: String(body.get('store-state')),
          zipcode: String(body.get('store-zipcode')),
          country: String(body.get('store-country')),
          type: AddressType.Store,
        },
        phone: String(body.get('store-phone')),
        email: String(body.get('store-email')),
        logo: String(body.get('store-logo')),
        banners: JSON.parse(String(body.get('banners'))),
        other: JSON.parse(String(body.get('other'))),
      })
    } else if (body.get('intent') === 'account-password') {
      await StoreConfig.updateStoreInfo({
        name: String(body.get('store-name')),
        description: String(body.get('store-description')),
        address: {
          id: '',
          address: String(body.get('store-address')),
          city: String(body.get('store-city')),
          state: String(body.get('store-state')),
          zipcode: String(body.get('store-zipcode')),
          country: String(body.get('store-country')),
          type: AddressType.Store,
        },
        phone: String(body.get('store-phone')),
        email: String(body.get('store-email')),
        logo: String(body.get('store-logo')),
        banners: JSON.parse(String(body.get('banners'))),
        other: JSON.parse(String(body.get('other'))),
      })
    }
    return json({ error: null, data: {} })
  } catch (e) {
    console.error(e) // TODO: replace this with a proper logger

    if (e?.code === FatalErrorTypes.DatabaseConnection) {
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
            { title: 'Settings', url: '/admin/settings', order: 5 },
          ],
          account: loaderData!.data!.account,
          storeSettings: loaderData!.data!.storeSettings,
        }}
      >
        <Settings />
      </AdminContext.Provider>
    </Suspense>
  )
}
