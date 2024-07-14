import {
  json,
  LoaderFunctionArgs,
  redirect,
  type MetaFunction,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { adminCookie } from '~/cookie'
import { CustomerModel } from '~/models'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import CustomerList from '~/themes/default/pages/admin/CustomerList'
import {
  JWTTokenSecretNotFoundException,
  UnAuthenticatedException,
} from '~/utils/exception'
import { isValid } from '~/utils/jwt'

export const meta: MetaFunction = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation()
  return [{ title: t('system.admin_dashboard_customers') }]
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

    const { accessToken } = await adminCookie.parse(cookieStr)

    if (!(await isValid(accessToken, process.env.JWT_TOKEN_SECRET))) {
      throw new UnAuthenticatedException()
    } else {
      const page = new URL(request.url).searchParams.get('page') || '1'
      const size = new URL(request.url).searchParams.get('size') || '20'
      const customers = await new CustomerModel().findMany(
        Number(page) < 1 ? 1 : Number(page),
        Number(size) < 1 ? 1 : Number(size),
      )
      return json({ error: null, data: customers })
    }
  } catch (e) {
    if (e instanceof JWTTokenSecretNotFoundException) {
      //TODO: handle this seperately
    } else if (e instanceof UnAuthenticatedException) {
      return redirect('/admin')
    }

    return json({ error: e, data: null })
  }
}

export default function Index() {
  const { data } = useLoaderData<typeof loader>()

  return (
    <Suspense fallback={<Skeleton />}>
      <CustomerList customers={data!} />
    </Suspense>
  )
}
