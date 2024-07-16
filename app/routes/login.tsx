import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useActionData } from '@remix-run/react'
import { Suspense } from 'react'
import { cookie } from '~/cookie'
import { CustomerAuthentication, Installer } from '~/models'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import Login from '~/themes/default/pages/account/Login'
import { Role } from '~/types'
import {
  JWTTokenSecretNotFoundException,
  StoreNotInstalledError,
} from '~/utils/exception'
import { encode } from '~/utils/jwt'

export const meta: MetaFunction = () => {
  return [{ title: 'Login' }]
}

export const loader = async () => {
  try {
    if (!(await Installer.isInstalled())) {
      throw new StoreNotInstalledError()
    }

    if (!process.env.JWT_TOKEN_SECRET) {
      throw new JWTTokenSecretNotFoundException()
    }

    return json({ error: null, data: {} })
  } catch (e) {
    if (e instanceof StoreNotInstalledError) {
      return redirect('/install')
    } else if (e instanceof JWTTokenSecretNotFoundException) {
      // TODO: handle this seperately
    }

    return json({ error: e, data: null })
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const body = await request.formData()
    const result = await CustomerAuthentication.login(
      String(body.get('email')),
      String(body.get('password')),
    )

    const data = {
      id: result.id,
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
      role: Role.Customer,
    }

    const accessToken = await encode('1h', data, process.env.JWT_TOKEN_SECRET!)
    const refreshToken = await encode('7d', data, process.env.JWT_TOKEN_SECRET!)

    return redirect(
      new URL(request.url).searchParams.get('ref') === 'cart'
        ? '/cart'
        : '/account',
      {
        headers: {
          'Set-Cookie': await cookie.serialize({
            accessToken,
            refreshToken,
          }),
        },
      },
    )
  } catch (e) {
    return json({ error: e, data: {} })
  }
}

export default function Index() {
  const actionData = useActionData<typeof action>()

  return (
    <Suspense fallback={<Skeleton />}>
      <Login isLoginSuccessful={actionData === undefined} />
    </Suspense>
  )
}
