import type { MetaFunction, ActionFunctionArgs } from '@remix-run/node'
import { redirect, json } from '@remix-run/node'
import { useActionData } from '@remix-run/react'
import Login from '~/themes/default/pages/admin/Login'
import { cookie } from '~/cookie'
import { Authtication } from '~/models'
import { encode } from '~/utils/jwt'
import { ServerInternalError } from '~/utils/exception'

export const meta: MetaFunction = () => {
  return [{ title: 'Admin Login' }]
}

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const body = await request.formData()
    const result = await Authtication.login(
      String(body.get('email')),
      String(body.get('password')),
    )

    if (!process.env.JWT_TOKEN_SECRET) {
      throw new ServerInternalError('Invalid JWT Token secret string.')
    }

    const accessToken = await encode(
      '1h',
      {
        id: result.id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
      },
      process.env.JWT_TOKEN_SECRET,
    )

    const refreshToken = await encode(
      '7d',
      {
        id: result.id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
      },
      process.env.JWT_TOKEN_SECRET,
    )

    return redirect('/admin', {
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
  const result = useActionData<typeof action>()
  return <Login isLoginSuccessful={!!result?.successful} />
}
