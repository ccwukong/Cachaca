import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useActionData, useLoaderData } from '@remix-run/react'
import { Suspense } from 'react'
import { adminCookie } from '~/cookie'
import { AdminAuthtication, Installer } from '~/models'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import Login from '~/themes/default/pages/admin/Login'
import { FatalErrorTypes, Role } from '~/types'
import {
  JWTTokenSecretNotFoundException,
  StoreNotInstalledError,
} from '~/utils/exception'
import { encode, isValid } from '~/utils/jwt'

export const meta: MetaFunction = () => {
  return [{ title: 'Admin Login' }]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    if (!(await Installer.isInstalled())) {
      throw new StoreNotInstalledError()
    }

    if (!process.env.JWT_TOKEN_SECRET) {
      throw new JWTTokenSecretNotFoundException()
    }

    // Redirect to admin dashboard if JWT token is valid
    const cookieStr = request.headers.get('Cookie') || ''
    if (cookieStr) {
      const { accessToken } = await adminCookie.parse(cookieStr)

      if (await isValid(accessToken, process.env.JWT_TOKEN_SECRET)) {
        return redirect('/admin')
      }
    }

    return json({ error: null, data: {} })
  } catch (e) {
    if (e instanceof StoreNotInstalledError) {
      return redirect('/install')
    } else if (e instanceof JWTTokenSecretNotFoundException) {
      //TODO: handle this seperately
    }

    return json({ error: e, data: null })
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const body = await request.formData()
    const result = await AdminAuthtication.login(
      String(body.get('email')),
      String(body.get('password')),
    )

    const data = {
      id: result.id,
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
      role: Role.Admin,
    }

    const accessToken = await encode('1h', data, process.env.JWT_TOKEN_SECRET!)
    const refreshToken = await encode('7d', data, process.env.JWT_TOKEN_SECRET!)

    return redirect('/admin', {
      headers: {
        'Set-Cookie': await adminCookie.serialize({
          accessToken,
          refreshToken,
        }),
      },
    })
  } catch (e) {
    console.error(e) // TODO: replace this with a proper logger

    if (e?.code === FatalErrorTypes.DatabaseConnection) {
      return redirect('/error')
    }
    return json({ error: e, data: null })
  }
}

export default function Index() {
  const actionData = useActionData<typeof action>()
  const loaderData = useLoaderData<typeof loader>()

  return (
    <Suspense fallback={<Skeleton />}>
      <Login isLoginSuccessful={actionData === undefined} />
    </Suspense>
  )
}
