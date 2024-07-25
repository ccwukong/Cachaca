import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useActionData } from '@remix-run/react'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'
import { adminCookie } from '~/cookie'
import { Installer } from '~/models'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import Install from '~/themes/default/pages/Install'
import { FatalErrorTypes, Role } from '~/types'
import { JWTTokenSecretNotFoundException } from '~/utils/exception'
import { encode } from '~/utils/jwt'

export const meta: MetaFunction = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation()
  return [{ title: t('system.installation') }]
}

export const loader = async () => {
  try {
    if (!process.env.JWT_TOKEN_SECRET) {
      throw new JWTTokenSecretNotFoundException()
    }

    //If the store is already installed, redirect to admin dashboard
    if (await Installer.isInstalled()) {
      return redirect('/admin')
    }

    return json({ error: null, data: {} })
  } catch (e) {
    console.error(e) // TODO: replace this with a proper logger
    if (e instanceof JWTTokenSecretNotFoundException) {
      // TODO: handle this separately
    } else if (e?.code === FatalErrorTypes.DatabaseConnection) {
      return redirect('/error')
    }

    return json({ error: e, data: null })
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const body = await request.formData()

    const result = await Installer.create({
      adminUser: {
        id: uuidv4(),
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
          accessToken: accessToken,
          refreshToken: refreshToken,
        }),
      },
    })
  } catch (e) {
    return json({ error: e, data: {} })
  }
}

export default function Index() {
  const actionData = useActionData<typeof action>()

  return (
    <Suspense fallback={<Skeleton />}>
      <Install isSubmitSuccessful={actionData === undefined} />
    </Suspense>
  )
}
