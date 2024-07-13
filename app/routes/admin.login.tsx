import type { MetaFunction, ActionFunctionArgs } from '@remix-run/node'
import { redirect, json } from '@remix-run/node'
import { useActionData } from '@remix-run/react'
import Login from '~/themes/default/pages/admin/Login'
import { cookie } from '~/cookie'
import { Installer, AdminAuthtication } from '~/models'
import { encode } from '~/utils/jwt'
import { ServerInternalError } from '~/utils/exception'
import { Role } from '~/types'

export const meta: MetaFunction = () => {
  return [{ title: 'Admin Login' }]
}

export const loader = async () => {
  if (!(await Installer.isInstalled())) {
    return redirect('/install')
  }

  return json({ message: 'test' })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const body = await request.formData()
    const result = await AdminAuthtication.login(
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
        role: Role.Admin,
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
        role: Role.Admin,
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
  let result = useActionData<typeof action>()
  // when form submission is successful, result will be undefined becuase of the redirect
  // It will cause the error message shown up unexpectedly
  // Add this defensive code here for now
  if (result === undefined) {
    result = { successful: true }
  }
  return <Login isLoginSuccessful={result.successful} />
}
