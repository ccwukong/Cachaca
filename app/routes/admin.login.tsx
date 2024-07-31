import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Suspense } from 'react'
import { adminCookie } from '~/cookie'
import { AdminAuthentication, Installer, StoreConfig } from '~/models'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import Login from '~/themes/default/pages/admin/Login'
import { EmailTemplate, ExternalApiType, FatalErrorTypes, Role } from '~/types'
import sendEmail from '~/utils/email'
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

    if (body.get('intent') === 'login') {
      const result = await AdminAuthentication.login(
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

      const accessToken = await encode(
        '1h',
        data,
        process.env.JWT_TOKEN_SECRET!,
      )
      const refreshToken = await encode(
        '7d',
        data,
        process.env.JWT_TOKEN_SECRET!,
      )

      return redirect('/admin', {
        headers: {
          'Set-Cookie': await adminCookie.serialize({
            accessToken,
            refreshToken,
          }),
        },
      })
    } else if (body.get('intent') === 'reset-password') {
      const result = await AdminAuthentication.getAdminNameByEmailIfRegistered(
        String(body.get('reset-password-email')),
      )

      if (result) {
        const token = await encode(
          '1h',
          { email: String(body.get('reset-password-email')) },
          process.env.PASSWORD_LINK_JWT_TOKEN_SECRET!,
        )

        //TODO: when installing store, insert this email template by default and make the template name uneditable
        const emailTemplate = await StoreConfig.getEmailTemplateByName(
          EmailTemplate.ForgotPassword,
        )
        const storeInfo = await StoreConfig.getStoreInfo()
        const emailApi = storeInfo.other?.apis[ExternalApiType.Email]

        sendEmail({
          endpoint: emailApi!.endpoint as string,
          apiToken: emailApi!.token as string,
          subject: emailTemplate.subject,
          body: emailTemplate.content
            .replace('{{name}}', `${result.firstName} ${result.lastName}`)
            .replace(
              '{{link}}',
              `<a href="${
                request.url.replace('login', 'reset-password') + '?t=' + token
              }">${
                request.url.replace('login', 'reset-password') + '?t=' + token
              }</a>`,
            ),
          from: storeInfo.email,
          sender: storeInfo.name,
          to: String(body.get('reset-password-email')),
        })
      }

      return json({ error: null, data: {} })
    }
  } catch (e) {
    console.error(e) // TODO: replace this with a proper logger

    if (e?.code === FatalErrorTypes.DatabaseConnection) {
      return redirect('/error')
    }
    return json({ error: e, data: null })
  }
}

export default function Index() {
  return (
    <Suspense fallback={<Skeleton />}>
      <Login />
    </Suspense>
  )
}
