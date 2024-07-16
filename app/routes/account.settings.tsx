import {
  json,
  LoaderFunctionArgs,
  redirect,
  type MetaFunction,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { cookie } from '~/cookie'
import { CustomerModel } from '~/models'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import Settings from '~/themes/default/pages/account/Settings'
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
        },
      })
    }
  } catch (e) {
    if (e instanceof TypeError || e instanceof UnAuthenticatedException) {
      return redirect('/account')
    } else if (e instanceof JWTTokenSecretNotFoundException) {
      //TODO: handle this seperately
    }

    return json({ error: e, data: null })
  }
}

export default function Index() {
  const {
    data: { account },
  } = useLoaderData<typeof loader>()
  return (
    <Suspense fallback={<Skeleton />}>
      <Settings storeLogo="" storeName="Cachaca" account={account} />
    </Suspense>
  )
}
