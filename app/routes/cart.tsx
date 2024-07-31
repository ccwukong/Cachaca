import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import StoreContext from '~/contexts/storeContext'
import { cookie } from '~/cookie'
import { AddressModel, Installer, StoreConfig } from '~/models'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import Cart from '~/themes/default/pages/storefront/Cart'
import {
  AddressItem,
  CategoryItem,
  FatalErrorTypes,
  ProductPublicInfo,
} from '~/types'
import {
  JWTTokenSecretNotFoundException,
  StoreNotInstalledError,
} from '~/utils/exception'
import { decode, isValid } from '~/utils/jwt'
import * as mocks from '~/utils/mocks'

export const meta: MetaFunction = ({ data }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation()
  return [{ title: `${data?.data?.storeSettings.name} - ${t('system.cart')}` }]
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

        if (await isValid(accessToken, process.env.JWT_TOKEN_SECRET)) {
          account = await decode(accessToken, process.env.JWT_TOKEN_SECRET)
          addresses = await new AddressModel().findManyByCustomerId(payload.id)
        }
      }
    }

    return json({
      error: null,
      data: {
        categories: await mocks.getCategories(),
        storeSettings: await StoreConfig.getStoreInfo(),
        publicPages: await StoreConfig.getPublicPages(),
        suggestedProducts:
          (await mocks.getMockProducts()) as ProductPublicInfo[],
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

    return json({ error: e, data: null })
  }
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>()

  return loaderData.data ? (
    <Suspense fallback={<Skeleton />}>
      <StoreContext.Provider
        value={{
          storeSettings: loaderData.data.storeSettings,
          categories: loaderData.data.categories as CategoryItem[],
          publicPages: loaderData.data.publicPages,
        }}
      >
        <Cart
          suggestedProducts={loaderData.data.suggestedProducts}
          shippingFee={loaderData.data.shippingFee}
          addresses={loaderData.data.addresses}
          allowVoucher={true}
          allowGuestCheckout={true}
          account={loaderData.data.account}
        />
      </StoreContext.Provider>
    </Suspense>
  ) : (
    <Skeleton />
  )
}
