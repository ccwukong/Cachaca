import type { MetaFunction, ActionFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useActionData } from '@remix-run/react'
import jwt from 'jsonwebtoken'
import Install from '~/themes/default/pages/Install'
import { cookie } from '~/cookie'
import { Installer } from '~/models'

export const meta: MetaFunction = () => {
  return [{ title: 'Store setup' }]
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

    const [accessToken, refreshToken] = [
      jwt.sign(
        {
          id: result.id,
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
        },
        process.env.JWT_TOKEN_SECRET as string, // TODO: throw an error if the secret is not set
        { expiresIn: '1h' },
      ),
      jwt.sign(
        {
          id: result.id,
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
        },
        process.env.JWT_TOKEN_SECRET as string,
        { expiresIn: '7d' },
      ),
    ]

    return redirect('/admin?installed=true', {
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
