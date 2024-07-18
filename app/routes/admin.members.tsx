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
import { FatalErrorTypes } from '~/types'
import {
  JWTTokenSecretNotFoundException,
  UnAuthenticatedException,
} from '~/utils/exception'
import { isValid } from '~/utils/jwt'

export const meta: MetaFunction = () => {
  return [{ title: 'Admin Dashboard - Store members' }]
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
      return json({ error: null, data: {} })
    }
  } catch (e) {
    console.error(e) // TODO: replace this with a proper logger
    if (e instanceof JWTTokenSecretNotFoundException) {
      //TODO: handle this seperately
    } else if (e instanceof UnAuthenticatedException) {
      return redirect('/admin')
    } else if (e?.code === FatalErrorTypes.DatabaseConnection) {
      return redirect('/error')
    }

    return json({ error: e, data: null })
  }
}

export default function Index() {
  return (
    <Suspense fallback={<Skeleton />}>
      <MemberList />
    </Suspense>
  )
}
