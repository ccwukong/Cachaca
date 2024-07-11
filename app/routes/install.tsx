import type { MetaFunction, ActionFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useActionData } from '@remix-run/react'
import Install from '~/themes/default/pages/Install'
import { cookie } from '~/cookie'
import { Installer } from '~/models'
import { encode } from '~/utils/jwt'
import { ServerInternalError } from '~/utils/exception'

export const meta: MetaFunction = () => {
  return [{ title: 'Store setup' }]
}

export const loader = async () => {
  if (await Installer.isInstalled()) {
    return redirect('/admin')
  }

  return json({ message: 'test' })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const body = await request.formData()

    const result = await Installer.create({
      adminUser: {
        firstName: String(body.get('firstName')),
        lastName: String(body.get('lastName')),
        email: String(body.get('email')),
        phone: String(body.get('phone')),
        password: String(body.get('password')),
      },
      store: {
        name: String(body.get('storeName')),
        description: String(body.get('description')),
      },
    })

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
      process.env.JWT_TOKEN_SECRET!,
    )

    const refreshToken = await encode(
      '7d',
      {
        id: result.id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
      },
      process.env.JWT_TOKEN_SECRET!,
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
    return json({ data: false })
  }
}

export default function Index() {
  const result = useActionData<typeof action>()
  return <Install isSubmitError={result ? false : true} />
}
