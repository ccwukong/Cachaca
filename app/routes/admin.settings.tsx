import {
  ActionFunctionArgs,
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
import { AdminAuthentication, StoreConfig, UserModel } from '~/models'
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
        data: {
          storeSettings: await StoreConfig.getStoreInfo(),
          currencies: await StoreConfig.getCurrencies(),
          publicPages: await StoreConfig.getPublicPages(),
          emailTemplates: await StoreConfig.getEmailTemplates(),
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
          baseCurrencyId: Number(body.get('store-currency')),
          other: {
            copyright: String(body.get('store-copyright-info')),
            apis: {
              [ExternalApiType.File]: {
                cloudName: String(body.get('file-cloud-name')),
                apiKey: String(body.get('file-api-key')),
                apiSecret: String(body.get('file-api-secret')),
              },
              [ExternalApiType.GenAI]: {
                model: String(body.get('genai-model')),
                apiKey: String(body.get('genai-api-key')),
              },
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
        await new UserModel().update({
          id: payload.id,
          firstName: String(body.get('firstname')),
          lastName: String(body.get('lastname')),
          phone: String(body.get('phone')),
          avatar: String(body.get('avatar')),
        })
      } else if (body.get('intent') === 'change-password') {
        await AdminAuthentication.updatePassword({
          email: payload.email,
          oldPwd: String(body.get('old-password')),
          newPwd: String(body.get('new-password')),
        })
      } else if (body.get('intent') === 'create-page') {
        await StoreConfig.createPublicPage({
          name: String(body.get('name')),
          slug: String(body.get('slug')),
          content: String(body.get('content')),
          order: Number(body.get('order')),
        })
      } else if (body.get('intent') === 'update-page') {
        await StoreConfig.updatePublicPageByName({
          name: String(body.get('name')),
          slug: String(body.get('slug')),
          content: String(body.get('content')),
          order: Number(body.get('order')),
        })
        return json({ error: null, data: {} }) //for modal dismissal
      } else if (body.get('intent') === 'delete-page') {
        await StoreConfig.deletePublicPageByName(String(body.get('name')))
        return json({ error: null, data: {} }) //for modal dismissal
      } else if (body.get('intent') === 'create-email-template') {
        await StoreConfig.createEmailTemplate({
          name: String(body.get('name')),
          subject: String(body.get('subject')),
          content: String(body.get('content')),
        })
      } else if (body.get('intent') === 'update-email-template') {
        await StoreConfig.updateEmailTemplateByName({
          name: String(body.get('name')),
          subject: String(body.get('subject')),
          content: String(body.get('content')),
        })
        return json({ error: null, data: {} }) //for modal dismissal
      } else if (body.get('intent') === 'delete-email-template') {
        await StoreConfig.deleteEmailTemplateByName(String(body.get('name')))
        return json({ error: null, data: {} }) //for modal dismissal
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
          publicPages: loaderData.data.publicPages,
          emailTemplates: loaderData.data.emailTemplates,
        }}
      >
        <Settings currencies={loaderData.data.currencies} />
      </AdminContext.Provider>
    </Suspense>
  ) : (
    <Skeleton />
  )
}
