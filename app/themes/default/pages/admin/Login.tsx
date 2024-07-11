import { useEffect, useState } from 'react'
import { Form } from '@remix-run/react'
import { useTranslation } from 'react-i18next'
import { AlertCircle } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '~/themes/default/components/ui/card'
import { Label } from '~/themes/default/components/ui/label'
import { Input } from '~/themes/default/components/ui/input'
import { Button } from '~/themes/default/components/ui/button'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/themes/default/components/ui/tabs'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '~/themes/default/components/ui/alert'

const Login = ({ isLoginSuccessful }: { isLoginSuccessful: boolean }) => {
  const { t } = useTranslation()
  const [isLoginSubmitted, setIsLoginSubmitted] = useState(false)

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
              <Form method="POST">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('system.email')}</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">{t('system.password')}</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    onClick={() => {
                      setIsLoginSubmitted(true)
                    }}
                  >
                    {t('system.login')}
                  </Button>
                  {!isLoginSuccessful && isLoginSubmitted ? (
                    <Alert variant="destructive" className="mt-3">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>{t('system.error')}</AlertTitle>
                      <AlertDescription>
                        {t('system.login_failed')}
                      </AlertDescription>
                    </Alert>
                  ) : null}
                </div>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>{t('system.reset_password')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">{t('system.email')}</Label>
                <Input id="current" type="email" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>{t('system.submit')}</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Login
