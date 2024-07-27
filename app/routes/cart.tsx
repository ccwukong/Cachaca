import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Stripe } from 'stripe'
import StoreContext from '~/contexts/storeContext'
import { cookie } from '~/cookie'
import { AddressModel, CustomerModel, Installer, StoreConfig } from '~/models'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import Cart from '~/themes/default/pages/storefront/Cart'
import { AddressItem, CategoryItem, FatalErrorTypes } from '~/types'
import {
  JWTTokenSecretNotFoundException,
  StoreNotInstalledError,
} from '~/utils/exception'
import { decode, isValid } from '~/utils/jwt'
import * as mocks from '~/utils/mocks'
import { makeStr } from '~/utils/string'
const stripe = new Stripe(
  'sk_test_51HTOdcKsqW6VdHcFVXZ2e0HKQ0OTS8KLPfUVydGloNZLa17vP8IVfago1MJLJshialmoiCRsSAVZNkPwdPq7Dwh1009kwA1OwA',
)

export const meta: MetaFunction = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation()
  return [{ title: t('system.cart') }]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    if (!(await Installer.isInstalled())) {
      throw new StoreNotInstalledError()
    }

    if (!process.env.JWT_TOKEN_SECRET) {
      throw new JWTTokenSecretNotFoundException()
    }

    let account = null
    let addresses: AddressItem[] = []
    const cookieStr = request.headers.get('Cookie') || ''

    if (cookieStr) {
      const { accessToken } = (await cookie.parse(cookieStr)) || {}

      if (await isValid(accessToken, process.env.JWT_TOKEN_SECRET)) {
        const payload = (await decode(
          accessToken,
          process.env.JWT_TOKEN_SECRET,
        )) as {
          id: string
          firstName: string
          lastName: string
          email: string
        }
        account = await new CustomerModel().find(payload.id)
        addresses = await new AddressModel().findManyByCustomerId(payload.id)
      }
    }

    return json({
      error: null,
      data: {
        categories: await mocks.getCategories(),
        storeSettings: await StoreConfig.getStoreInfo(),
        suggestedProducts: await mocks.getMockProducts(),
        addresses,
        shippingFee: '9.9',
        account,
      },
    })
  } catch (e) {
    console.error(e) // TODO: replace this with a proper logger
    if (e instanceof StoreNotInstalledError) {
      return redirect('/install')
    } else if (e instanceof JWTTokenSecretNotFoundException) {
      //TODO: handle this seperately
    } else if (e?.code === FatalErrorTypes.DatabaseConnection) {
      return redirect('/error')
    }

    return json({ error: e, data: {} })
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    // TODO: This is ONLY for Stripe integration testing purpose. creating Stripe producst should happen
    // when store admin creating a new product, not here
    // The Stripe api key should be stored in database instead hardcoding here
    const body = await request.formData()
    const cart = JSON.parse(body.get('cart'))

    const res = cart.map(async (item) => {
      return {
        quantity: item.quantity,
        price: (
          await stripe.products.create({
            id: item.id + makeStr(3),
            name: item.name,
            images: [item.image],
            url: `http://localhost:5173/${item.url}`,
            default_price_data: {
              currency: String(body.get('currency')),
              tax_behavior: 'inclusive',
              unit_amount: item.price * 100,
            },
            shippable: true,
          })
        ).default_price,
      }
    })
    const data = []
    for await (const item of res) {
      data.push(item)
    }

    const session = await stripe.checkout.sessions.create({
      line_items: data,
      mode: 'payment',
      success_url: `http://localhost:5173/cart?success=true`,
      cancel_url: `http://localhost:5173/cart?canceled=true`,
    })
    console.log(session)
    return redirect(session.url!)
    return json({})
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
  console.log(loaderData!.data!.storeSettings)
  return (
    <Suspense fallback={<Skeleton />}>
      <StoreContext.Provider
        value={{
          account: loaderData!.data!.account,
          storeSettings: loaderData!.data!.storeSettings,
          categories: loaderData!.data!.categories as CategoryItem[],
        }}
      >
        <Cart
          suggestedProducts={loaderData!.data!.suggestedProducts}
          shippingFee={loaderData!.data!.shippingFee}
          addresses={loaderData!.data!.addresses}
          allowVoucher={true}
          allowGuestCheckout={true}
          account={loaderData!.data!.account}
        />
      </StoreContext.Provider>
    </Suspense>
  )
}
