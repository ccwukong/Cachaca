import { useEffect, useState } from 'react'
import { Link, Form } from '@remix-run/react'
import { useTranslation } from 'react-i18next'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '~/themes/default/components/ui/card'
import { Label } from '~/themes/default/components/ui/label'
import { Input } from '~/themes/default/components/ui/input'
import { Button } from '~/themes/default/components/ui/button'

const Login = () => {
  const { t } = useTranslation()
  const [isLoginSubmitted, setIsLoginSubmitted] = useState<boolean>(false)

  return (
    <div className="mx-6 overflow-hidden lg:mx-0">
      <Card className="mx-auto max-w-sm mt-28">
        <CardHeader>
          <CardTitle className="text-2xl">{t('system.login')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form method="POST" className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">{t('system.email')}</Label>
              <Input id="email" type="email" required />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">{t('system.password')}</Label>
                <Link
                  to="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  {t('system.forgot_password_hint')}
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              {t('system.login')}
            </Button>
          </Form>

          <div className="mt-4 text-center text-sm">
            {t('system.do_not_have_account_hint')}{' '}
            <Link to="/register" className="underline">
              {t('system.sign_up')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
