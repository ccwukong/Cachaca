import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Suspense } from 'react'
import { cookie } from '~/cookie'
import { Installer } from '~/models'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import Cart from '~/themes/default/pages/storefront/Cart'
import {
  JWTTokenSecretNotFoundException,
  StoreNotInstalledError,
} from '~/utils/exception'
import { decode, isValid } from '~/utils/jwt'
import * as mocks from '~/utils/mocks'

export const meta: MetaFunction = () => {
  return [{ title: 'Cart' }]
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
    const cookieStr = request.headers.get('Cookie') || ''

    if (cookieStr) {
      const { accessToken } = (await cookie.parse(cookieStr)) || {}

      if (await isValid(accessToken, process.env.JWT_TOKEN_SECRET)) {
        account = await decode(accessToken, process.env.JWT_TOKEN_SECRET)
      }
    }

    return json({
      error: null,
      data: {
        categories: await mocks.getCategories(),
        storeSettings: await mocks.getStoreInfo(),
        suggestedProducts: await mocks.getMockProducts(),
        shippingFee: '9.9',
        account,
      },
    })
  } catch (e) {
    console.log(e)
    if (e instanceof StoreNotInstalledError) {
      return redirect('/install')
    } else if (e instanceof JWTTokenSecretNotFoundException) {
      //TODO: handle this seperately
    }

    return json({ error: e, data: {} })
  }
}

export default function Index() {
  const {
    data: {
      categories,
      storeSettings,
      suggestedProducts,
      shippingFee,
      account,
    },
  } = useLoaderData<typeof loader>()

  return (
    <Suspense fallback={<Skeleton />}>
      <Cart
        categories={categories}
        storeSettings={storeSettings}
        suggestedProducts={suggestedProducts}
        shippingFee={shippingFee}
        allowVoucher={true}
        allowGuestCheckout={true}
        account={account}
      />
    </Suspense>
  )
}
