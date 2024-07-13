import {
  json,
  LoaderFunctionArgs,
  redirect,
  type MetaFunction,
} from '@remix-run/node'
import { useTranslation } from 'react-i18next'
import { cookie } from '~/cookie'
import Settings from '~/themes/default/pages/account/Settings'

export const meta: MetaFunction = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation()
  return [{ title: t('system.account_dashboard_settings') }]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const cookieStr = request.headers.get('Cookie') || ''
    if (!cookieStr) {
      return redirect('/account')
    }
    const { accessToken } = cookie.parse(cookieStr)
    return json({ successful: true })
  } catch (e) {
    if (e instanceof TypeError) {
      return redirect('/account')
    } else {
      return json({ successful: false })
    }
  }
}

export default function Index() {
  return <Settings storeLogo="" storeName="Cachaca" />
}
