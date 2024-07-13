import { Form, Link } from '@remix-run/react'
import { AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '~/themes/default/components/ui/alert'
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

const Login = ({ isLoginSuccessful }: { isLoginSuccessful: boolean }) => {
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
              <Input
                id="email"
                name="email"
                type="email"
                onChange={() => {
                  setIsLoginSubmitted(false)
                }}
                required
              />
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
              <Input
                id="password"
                type="password"
                name="password"
                onChange={() => {
                  setIsLoginSubmitted(false)
                }}
                required
              />
            </div>
            <Button
              type="submit"
              onClick={() => {
                setIsLoginSubmitted(true)
              }}
              className="w-full"
            >
              {isLoginSubmitted ? (
                <Spinner size="small" className="text-white" />
              ) : (
                t('system.login')
              )}
            </Button>
            {!isLoginSuccessful && isLoginSubmitted ? (
              <Alert variant="destructive" className="mt-3">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t('system.error')}</AlertTitle>
                <AlertDescription>{t('system.login_failed')}</AlertDescription>
              </Alert>
            ) : null}
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
