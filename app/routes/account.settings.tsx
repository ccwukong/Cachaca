import {
  json,
  LoaderFunctionArgs,
  redirect,
  type MetaFunction,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import CustomerContext from '~/contexts/customerContext'
import { cookie } from '~/cookie'
import { CustomerModel, StoreConfig } from '~/models'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import Settings from '~/themes/default/pages/account/Settings'
import { FatalErrorTypes } from '~/types'
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
        <Settiangs />
      </CustomerContext.Provider>
    </Suspense>
  )
}
