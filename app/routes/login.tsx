import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useActionData } from '@remix-run/react'
import { Suspense } from 'react'
import { cookie } from '~/cookie'
import { CustomerAuthentication, Installer } from '~/models'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import Login from '~/themes/default/pages/account/Login'
import { Role } from '~/types'
import { ServerInternalError } from '~/utils/exception'
import { encode } from '~/utils/jwt'

export const meta: MetaFunction = () => {
  return [{ title: 'Login' }]
}

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    if (!(await Installer.isInstalled())) {
      return redirect('/install')
    }

    const body = await request.formData()
    const result = await CustomerAuthentication.login(
      String(body.get('email')),
      String(body.get('password')),
    )

    if (!process.env.JWT_TOKEN_SECRET) {
      throw new ServerInternalError('Invalid JWT Token secret string.')
    }

    const data = {
      id: result.id,
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
      role: Role.Customer,
    }

    const accessToken = await encode('1h', data, process.env.JWT_TOKEN_SECRET)
    const refreshToken = await encode('7d', data, process.env.JWT_TOKEN_SECRET)

    return redirect('/account', {
      headers: {
        'Set-Cookie': await cookie.serialize({
          accessToken: accessToken,
          refreshToken: refreshToken,
        }),
      },
    })
  } catch (e) {
    return json({ successful: false })
  }
}

export default function Index() {
  let result = useActionData<typeof action>()
  // when form submission is successful, result will be undefined becuase of the redirect
  // It will cause the error message shown up unexpectedly
  // Add this defensive code here for now
  if (result === undefined) {
    result = { successful: true }
  }
  return (
    <Suspense fallback={<Skeleton />}>
      <Login isLoginSuccessful={result.successful} />
    </Suspense>
  )
}
