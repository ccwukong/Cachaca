import {
  json,
  LoaderFunctionArgs,
  redirect,
  type MetaFunction,
} from '@remix-run/node'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { adminCookie } from '~/cookie'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import CustomerList from '~/themes/default/pages/admin/CustomerList'
import { ServerInternalError } from '~/utils/exception'
import { isValid } from '~/utils/jwt'

export const meta: MetaFunction = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation()
  return [{ title: t('system.admin_dashboard_customers') }]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const cookieStr = request.headers.get('Cookie') || ''
    if (!cookieStr) {
      return redirect('/admin/login')
    }

    const { accessToken } = await adminCookie.parse(cookieStr)

    if (!process.env.JWT_TOKEN_SECRET) {
      throw new ServerInternalError('Invalid JWT Token secret string.')
    }

    if (!(await isValid(accessToken, process.env.JWT_TOKEN_SECRET))) {
      return redirect('/admin')
    } else {
      return json({ successful: false })
    }
  } catch (e) {
    if (e instanceof TypeError) {
      return redirect('/admin')
    } else {
      return json({ successful: false })
    }
  }
}

export default function Index() {
  return (
    <Suspense fallback={<Skeleton />}>
      <CustomerList />
    </Suspense>
  )
}
