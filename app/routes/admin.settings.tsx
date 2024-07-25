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
import { AdminAuthtication, StoreConfig, UserModel } from '~/models'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import Settings from '~/themes/default/pages/admin/Settings'
import {
  AddressType,
  ExternalApiType,
  FatalErrorTypes,
  FileHostingProvider,
} from '~/types'
import {
  JWTTokenSecretNotFoundException,
  ServerInternalError,
  UnAuthenticatedException,
} from '~/utils/exception'
import fileUpload from '~/utils/file'
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
      const body = await request.formData()
      /**
       * We use a single form to capture data updates for store settings
       * and store banner settings and file uploads.
       *
       * The trick here is to use the same name for all Buttons, and use
       * the button values to differentiate the action types
       */
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
          other: {
            copyright: String(body.get('store-copyright-info')),
            apis: {
              [ExternalApiType.File]: {
                cloudName: String(body.get('file-cloud-name')),
                apiKey: String(body.get('file-api-key')),
                apiSecret: String(body.get('file-api-secret')),
              },
              [ExternalApiType.GenAI]: {},
              [ExternalApiType.Email]: {
                endpoint: String(body.get('email-endpoint')),
                token: String(body.get('email-token')),
              },
            },
          },
        })
      } else if (body.get('intent') === 'store-banners') {
        await StoreConfig.updateStoreBanners({
          name: String(body.get('store-name')),
          banners: {
            autoplay: String(body.get('store-banner-autoplay')) === 'on',
            speed: Number(body.get('store-banner-speed')),
            items: JSON.parse(String(body.get('store-banner-items'))),
          },
        })
      } else if (body.get('intent') === 'remove-banner-image') {
        const storeSettings = await StoreConfig.getStoreInfo()
        await StoreConfig.updateStoreBanners({
          name: String(body.get('store-name')),
          banners: {
            autoplay: storeSettings.banners!.autoplay,
            speed: storeSettings.banners!.speed,
            items: JSON.parse(String(body.get('store-banner-items'))),
          },
        })
      } else if (body.get('intent') === 'upload-banner') {
        // upload homepage banner image to Cloudinary by default, and update database
        // TODO: make file uploader a plugin
        const storeSettings = await StoreConfig.getStoreInfo()

        const res = (await fileUpload(
          FileHostingProvider.Cloudinary,
          body.get('store-banner-upload') as File,
          {
            cloudName: storeSettings.other?.apis[ExternalApiType.File]
              .cloudName as string,
            apiKey: storeSettings.other?.apis[ExternalApiType.File]
              .apiKey as string,
            apiSecret: storeSettings.other?.apis[ExternalApiType.File]
              .apiSecret as string,
          },
        )) as { [key: string]: string }

        if (res) {
          await StoreConfig.updateStoreBanners({
            name: String(body.get('store-name')),
            banners: {
              autoplay: storeSettings.banners?.autoplay || false,
              speed: storeSettings.banners?.speed || 0,
              items: (storeSettings.banners?.items || []).concat([
                {
                  id: res.public_id,
                  imageUrl: res.secure_url,
                  caption: res.original_filename,
                  order: -1,
                  link: '',
                },
              ]),
            },
          })

          return json({
            error: null,
            data: {
              intent: 'upload-banner',
              file: {
                id: res.public_id,
                imageUrl: res.secure_url,
                caption: res.original_filename,
              },
            },
          })
        } else {
          return json({
            error: new ServerInternalError(),
            data: null,
          })
        }
      } else if (body.get('intent') === 'upload-logo') {
        // store logo
        const storeSettings = await StoreConfig.getStoreInfo()

        const res = (await fileUpload(
          FileHostingProvider.Cloudinary,
          body.get('store-logo') as File,
          {
            cloudName: storeSettings.other?.apis[ExternalApiType.File]
              .cloudName as string,
            apiKey: storeSettings.other?.apis[ExternalApiType.File]
              .apiKey as string,
            apiSecret: storeSettings.other?.apis[ExternalApiType.File]
              .apiSecret as string,
          },
        )) as { [key: string]: string }

        if (res) {
          await StoreConfig.updateStoreLogo({
            name: String(body.get('store-name')),
            logo: res.secure_url,
          })

          return json({
            error: null,
            data: {
              intent: 'upload-logo',
              file: {
                imageUrl: res.secure_url,
              },
            },
          })
        } else {
          return json({
            error: new ServerInternalError(),
            data: null,
          })
        }
      } else if (body.get('intent') === 'account-info') {
      } else if (body.get('intent') === 'change-password') {
        await AdminAuthtication.updatePassword({
          email: payload.email,
          oldPwd: String(body.get('old-password')),
          newPwd: String(body.get('new-password')),
        })
      }
      return json({ error: null, data: {} })
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
        <Settings />
      </AdminContext.Provider>
    </Suspense>
  )
}
