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
import { v4 as uuidv4 } from 'uuid'
import CustomerContext from '~/contexts/customerContext'
import { cookie } from '~/cookie'
import {
  AddressModel,
  CustomerAuthentication,
  CustomerModel,
  StoreConfig,
} from '~/models'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import Settings from '~/themes/default/pages/account/Settings'
import { AddressItem, AddressType, FatalErrorTypes } from '~/types'
import {
  JWTTokenSecretNotFoundException,
  UnAuthenticatedException,
} from '~/utils/exception'
import { decode, isValid } from '~/utils/jwt'

export const meta: MetaFunction = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation()
  return [{ title: t('system.account_dashboard_settings') }]
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
    const { accessToken } = await cookie.parse(cookieStr)
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

      const account = await new CustomerModel().find(payload.id)
      return json({
        error: null,
        data: {
          account,
          storeSettings: await StoreConfig.getStoreInfo(),
          AddressItems: await new AddressModel().findManyByCustomerId(
            payload.id,
          ),
        },
      })
    }
  } catch (e) {
    console.error(e) // TODO: replace this with a proper logger
    if (e instanceof TypeError || e instanceof UnAuthenticatedException) {
      return redirect('/account')
    } else if (e instanceof JWTTokenSecretNotFoundException) {
      //TODO: handle this seperately
    } else if (e?.code === FatalErrorTypes.DatabaseConnection) {
      return redirect('/error')
    }

    return json({ error: e, data: null })
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const body = await request.formData()
    if (!process.env.JWT_TOKEN_SECRET) {
      throw new JWTTokenSecretNotFoundException()
    }

    const cookieStr = request.headers.get('Cookie') || ''
    if (!cookieStr) {
      throw new UnAuthenticatedException()
    }
    const { accessToken } = await cookie.parse(cookieStr)
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
      if (body.get('intent') === 'account-info') {
        await new CustomerModel().update({
          id: payload.id,
          firstName: String(body.get('firstname')),
          lastName: String(body.get('lastname')),
          phone: String(body.get('phone')),
          avatar: String(body.get('avatar')),
        })
      } else if (body.get('intent') === 'update-address') {
        const address = new AddressModel()
        const res = await address.findManyByCustomerId(payload.id)

        if (!res.length) {
          const shipping = await address.create({
            id: uuidv4(),
            customerId: payload.id,
            address: String(body.get('shipping-address')),
            city: String(body.get('shipping-address-city')),
            state: String(body.get('shipping-address-state')),
            country: String(body.get('shipping-address-country')),
            zipcode: String(body.get('shipping-address-zipcode')),
            type: AddressType.Shipping,
          })

          const billing = await address.create({
            id: uuidv4(),
            customerId: payload.id,
            address: String(body.get('billing-address')),
            city: String(body.get('billing-address-city')),
            state: String(body.get('billing-address-state')),
            country: String(body.get('billing-address-country')),
            zipcode: String(body.get('billing-address-zipcode')),
            type: AddressType.Billing,
          })

          return json({
            error: null,
            data: { shippingAddress: shipping, billingAddress: billing },
          })
        } else {
          await address.update({
            id: String(body.get('shipping-address-id')),
            address: String(body.get('shipping-address')),
            city: String(body.get('shipping-address-city')),
            state: String(body.get('shipping-address-state')),
            country: String(body.get('shipping-address-country')),
            zipcode: String(body.get('shipping-address-zipcode')),
            type: AddressType.Shipping,
          })

          await address.update({
            id: String(body.get('billing-address-id')),
            address: String(body.get('billing-address')),
            city: String(body.get('billing-address-city')),
            state: String(body.get('billing-address-state')),
            country: String(body.get('billing-address-country')),
            zipcode: String(body.get('billing-address-zipcode')),
            type: AddressType.Billing,
          })
        }
      } else if (body.get('intent') === 'change-password') {
        await CustomerAuthentication.updatePassword({
          email: payload.email,
          oldPwd: String(body.get('old-password')),
          newPwd: String(body.get('new-password')),
        })
      }
    }
    return json({ error: null, data: {} })
  } catch (e) {
    console.error(e) // TODO: replace this with a proper logger

    if (e instanceof TypeError || e instanceof UnAuthenticatedException) {
      return redirect('/account')
    } else if (e instanceof JWTTokenSecretNotFoundException) {
      //TODO: handle this seperately
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
      <CustomerContext.Provider
        value={{
          account: loaderData!.data!.account,
          storeSettings: loaderData!.data!.storeSettings,
        }}
      >
        <Settings
          addressItems={loaderData!.data!.AddressItems as AddressItem[]}
        />
      </CustomerContext.Provider>
    </Suspense>
  )
}
