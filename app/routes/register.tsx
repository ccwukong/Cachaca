import {
  ActionFunctionArgs,
  json,
  redirect,
  type MetaFunction,
} from '@remix-run/node'
import { useActionData } from '@remix-run/react'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { cookie } from '~/cookie'
import { CustomerAuthentication, Installer } from '~/models'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import Register from '~/themes/default/pages/account/Register'
import { Role } from '~/types'
import { ServerInternalError } from '~/utils/exception'
import { encode } from '~/utils/jwt'

export const meta: MetaFunction = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation()
  return [{ title: t('system.create_new_account') }]
}

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    if (!(await Installer.isInstalled())) {
      return redirect('/install')
    }

    const body = await request.formData()

    const result = await CustomerAuthentication.register({
      firstName: String(body.get('firstName')),
      lastName: String(body.get('lastName')),
      email: String(body.get('email')),
      password: String(body.get('password')),
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
        role: Role.Customer,
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
        role: Role.Customer,
      },
      process.env.JWT_TOKEN_SECRET,
    )

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
      <Register isSubmitSuccessful={result.successful} />
    </Suspense>
  )
}
