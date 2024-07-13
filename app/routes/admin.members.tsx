import {
  json,
  LoaderFunctionArgs,
  redirect,
  type MetaFunction,
} from '@remix-run/node'
import { Suspense } from 'react'
import { adminCookie } from '~/cookie'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import MemberList from '~/themes/default/pages/admin/MemberList'
import { ServerInternalError } from '~/utils/exception'
import { isValid } from '~/utils/jwt'

export const meta: MetaFunction = () => {
  return [{ title: 'Admin Dashboard - Store members' }]
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
      <MemberList />
    </Suspense>
  )
}
