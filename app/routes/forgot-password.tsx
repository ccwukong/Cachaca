import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { CustomerAuthentication, Installer, StoreConfig } from '~/models'
import Skeleton from '~/themes/default/components/ui/storefront/Skeleton'
import ForgotPassword from '~/themes/default/pages/account/ForgotPassword'
import { EmailTemplate, ExternalApiType, FatalErrorTypes } from '~/types'
import sendEmail from '~/utils/email'
import {
  JWTTokenSecretNotFoundException,
  StoreNotInstalledError,
} from '~/utils/exception'
import { encode } from '~/utils/jwt'

export const meta: MetaFunction = ({ data }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation()
  return [
    {
      title: `${data?.data?.storeSettings.name} - ${t(
        'system.forgot_password',
      )}`,
    },
  ]
}

export const loader = async () => {
  try {
    if (!(await Installer.isInstalled())) {
      throw new StoreNotInstalledError()
    }

    if (!process.env.JWT_TOKEN_SECRET) {
      throw new JWTTokenSecretNotFoundException()
    }

    return json({
      error: null,
      data: { storeSettings: await StoreConfig.getStoreInfo() },
    })
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
    const result = await CustomerAuthentication.isEmailRegistered(
      String(body.get('email')),
    )

    if (result) {
      const token = await encode(
        '1h',
        { email: String(body.get('email')) },
        process.env.JWT_TOKEN_SECRET!,
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
          .replace('{{customer}}', 'Test name')
          .replace(
            '{{link}}',
            `<a href="${
              request.url.replace('forgot-', 'reset-') + '?t=' + token
            }">${request.url.replace('forgot-', 'reset-') + '?t=' + token}</a>`,
          ),
        from: storeInfo.email,
        sender: storeInfo.name,
        to: String(body.get('email')),
      })
    }

    return json({ error: null, data: {} })
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
      <ForgotPassword />
    </Suspense>
  )
}
