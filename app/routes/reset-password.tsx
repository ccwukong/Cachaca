import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { cookie } from '~/cookie'
import { CustomerAuthentication, Installer, StoreConfig } from '~/models'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import ResetPassword from '~/themes/default/pages/account/ResetPassword'
import { FatalErrorTypes, Role } from '~/types'
import {
  JWTTokenSecretNotFoundException,
  StoreNotInstalledError,
} from '~/utils/exception'
import { decode, encode, isValid } from '~/utils/jwt'

export const meta: MetaFunction = ({ data }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation()
  return [
    {
      title: `${data?.data?.storeSettings.name} - ${t(
        'system.reset_password',
      )}`,
    },
  ]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    if (!(await Installer.isInstalled())) {
      throw new StoreNotInstalledError()
    }

    if (!process.env.JWT_TOKEN_SECRET) {
      throw new JWTTokenSecretNotFoundException()
    }

    const token = new URL(request.url).searchParams.get('t')

    if (
      await isValid(token || '', process.env.PASSWORD_LINK_JWT_TOKEN_SECRET!)
    ) {
      const payload = (await decode(
        token || '',
        process.env.PASSWORD_LINK_JWT_TOKEN_SECRET!,
      )) as {
        email: string
        iat: number
        exp: number
      }

      return json({
        error: null,
        data: {
          email: payload.email,
          storeSettings: await StoreConfig.getStoreInfo(),
        },
      })
    } else {
      return redirect('/forgot-password')
    }
  } catch (e) {
    if (e instanceof StoreNotInstalledError) {
      return redirect('/install')
    } else if (e instanceof JWTTokenSecretNotFoundException) {
      // TODO: handle this seperately
    } else if (e?.code === FatalErrorTypes.DatabaseConnection) {
      return redirect('/error')
    }

    return json({ error: e, data: null })
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const body = await request.formData()
    await CustomerAuthentication.resetPassword({
      email: String(body.get('email')),
      newPwd: String(body.get('password')),
    })

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

    return redirect('/account', {
      headers: {
        'Set-Cookie': await cookie.serialize({
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
  const loaderData = useLoaderData<typeof loader>()
  return loaderData.data ? (
    <Suspense fallback={<Skeleton />}>
      <ResetPassword email={loaderData.data.email} />
    </Suspense>
  ) : (
    <Skeleton />
  )
}
