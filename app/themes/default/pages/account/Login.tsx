import { Link } from '@remix-run/react'
import { useTranslation } from 'react-i18next'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '~/themes/default/components/ui/card'
import { Label } from '~/themes/default/components/ui/label'
import { Input } from '~/themes/default/components/ui/input'
import { Button } from '~/themes/default/components/ui/button'

const Login = () => {
  const { t } = useTranslation()
  return (
    <div className="mx-6 overflow-hidden lg:mx-0">
      <Card className="mx-auto max-w-sm mt-28">
        <CardHeader>
          <CardTitle className="text-2xl">{t('system.login')}</CardTitle>
          <CardDescription>{t('system.login_hint')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">{t('system.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">{t('system.password')}</Label>
                <Link to="#" className="ml-auto inline-block text-sm underline">
                  {t('system.forgot_password_hint')}
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              {t('system.login')}
            </Button>
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link to="#" className="underline">
              {t('system.sign_up')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
