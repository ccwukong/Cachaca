import { Link, useFetcher } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '~/themes/default/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/themes/default/components/ui/card'
import { Input } from '~/themes/default/components/ui/input'
import { Label } from '~/themes/default/components/ui/label'
import { Spinner } from '~/themes/default/components/ui/spinner'

const ForgotPassword = () => {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const [formData, SetFormData] = useState<{
    email: string
  }>({ email: '' })
  const [formCompleted, setFormCompleted] = useState<boolean>(false)

  useEffect(() => {
    const { email } = formData

    if (email) {
      setFormCompleted(true)
    } else {
      setFormCompleted(false)
    }
  }, [formData])

  return (
    <div className="mx-6 overflow-hidden">
      {fetcher.state === 'idle' &&
      'data' in ((fetcher.data as object) || {}) ? (
        <Card className="mx-auto max-w-sm mt-28">
          <CardHeader>
            <CardTitle className="text-2xl">
              {t('system.forgot_password_hint')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <fetcher.Form method="POST" className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">{t('system.email')}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  onChange={(e) => {
                    SetFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={!formCompleted}
              >
                {fetcher.state !== 'idle' ? (
                  <Spinner size="small" className="text-white" />
                ) : (
                  t('system.get_reset_password_link')
                )}
              </Button>
            </fetcher.Form>
            <div className="mt-4 text-center text-sm">
              {t('system.do_not_have_account_hint')}{' '}
              <Link to="/register" className="underline">
                {t('system.sign_up')}
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-64 text-center">
          <p className="text-lg">
            {t('system.check_forgot_password_email_link')}
          </p>
          <div className="mt-4 text-center">
            <Link to="/login" className="underline">
              {t('system.go_to_login')}
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default ForgotPassword
