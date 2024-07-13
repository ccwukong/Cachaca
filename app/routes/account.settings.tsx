import {
  json,
  LoaderFunctionArgs,
  redirect,
  type MetaFunction,
} from '@remix-run/node'
import { useTranslation } from 'react-i18next'
import Settings from '~/themes/default/pages/account/Settings'

export const meta: MetaFunction = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation()
  return [{ title: t('system.account_dashboard_settings') }]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieStr = request.headers.get('Cookie') || ''
  if (!cookieStr) {
    return redirect('/account')
  }

  return json({ successful: true })
}

export default function Index() {
  return <Settings storeLogo="" storeName="Cachaca" />
}
