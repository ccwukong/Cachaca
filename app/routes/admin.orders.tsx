import {
  json,
  LoaderFunctionArgs,
  redirect,
  type MetaFunction,
} from '@remix-run/node'
import { isValid } from '~/utils/jwt'
import { adminCookie } from '~/cookie'
import OrderList from '~/themes/default/pages/admin/OrderList'
import { ServerInternalError } from '~/utils/exception'

export const meta: MetaFunction = () => {
  return [{ title: 'Admin Dashboard - Orders' }]
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
    return json({ successful: false })
  }
}

export default function Index() {
  return <OrderList />
}
