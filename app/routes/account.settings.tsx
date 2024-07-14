import {
  json,
  LoaderFunctionArgs,
  redirect,
  type MetaFunction,
} from '@remix-run/node'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { cookie } from '~/cookie'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import Settings from '~/themes/default/pages/account/Settings'
import {
  JWTTokenSecretNotFoundException,
  UnAuthenticatedException,
} from '~/utils/exception'
import { isValid } from '~/utils/jwt'

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
      return json({ error: null, data: {} })
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
  return (
    <Suspense fallback={<Skeleton />}>
      <Settings storeLogo="" storeName="Cachaca" />
    </Suspense>
  )
}
