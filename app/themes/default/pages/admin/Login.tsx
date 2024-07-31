import { useFetcher } from '@remix-run/react'
import { AlertCircle } from 'lucide-react'
import { useState } from 'react'
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
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/themes/default/components/ui/card'
import { Input } from '~/themes/default/components/ui/input'
import { Label } from '~/themes/default/components/ui/label'
import { Spinner } from '~/themes/default/components/ui/spinner'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/themes/default/components/ui/tabs'

const Login = () => {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const [formData, SetFormData] = useState<{
    email: string
    password: string
    pwdEmail: string
  }>({ email: '', password: '', pwdEmail: '' })

  return (
    <div className="max-w-screen-xl mx-auto h-full pt-24 flex justify-center">
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">{t('system.admin_account')}</TabsTrigger>
          <TabsTrigger value="password">
            {t('system.forgot_password_hint')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card className="mx-auto max-w-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">
                {t('system.admin_login')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <fetcher.Form method="POST">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('system.email')}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => {
                        SetFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">{t('system.password')}</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => {
                        SetFormData({
                          ...formData,
                          password: e.target.value,
                        })
                      }}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    name="intent"
                    value="login"
                  >
                    {fetcher.state !== 'idle' &&
                    fetcher.formData?.get('login') ? (
                      <Spinner size="small" className="text-white" />
                    ) : (
                      t('system.login')
                    )}
                  </Button>
                  {fetcher.state === 'idle' && fetcher.data?.error ? (
                    <Alert variant="destructive" className="mt-3">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>{t('system.error')}</AlertTitle>
                      <AlertDescription>
                        {t('system.login_failed')}
                      </AlertDescription>
                    </Alert>
                  ) : null}
                </div>
              </fetcher.Form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <fetcher.Form method="POST">
            <Card>
              <CardHeader>
                <CardTitle>{t('system.reset_password')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="reset-password-email">
                    {t('system.email')}
                  </Label>
                  <Input
                    id="reset-password-email"
                    name="reset-password-email"
                    type="email"
                    value={formData.pwdEmail}
                    onChange={(e) => {
                      SetFormData({
                        ...formData,
                        pwdEmail: e.target.value,
                      })
                    }}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" name="intent" value="reset-password">
                  {fetcher.state !== 'idle' &&
                  fetcher.formData?.get('reset-password') ? (
                    <Spinner size="small" className="text-white" />
                  ) : (
                    t('system.login')
                  )}
                </Button>
              </CardFooter>
            </Card>
          </fetcher.Form>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Login
