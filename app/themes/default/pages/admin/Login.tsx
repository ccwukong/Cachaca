import { Link } from '@remix-run/react'
import { useTranslation } from 'react-i18next'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
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

const Login = () => {
  const { t } = useTranslation()
  return (
    <div className="max-w-screen-xl mx-auto h-full pt-24 flex justify-center">
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">
            {t('system.forgot_password_hint')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card className="mx-auto max-w-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Admin login</CardTitle>
              <CardDescription>
                Enter your email and password to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('system.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t('system.password')}</Label>
                  <Input id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                  {t('system.login')}
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Link to="/admin/register">Don't have an account?</Link>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Reset password</CardTitle>
              <CardDescription>
                Enter your email to reset your password
              </CardDescription>
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
