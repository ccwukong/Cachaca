import { useFetcher } from '@remix-run/react'
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

const ResetPassword = ({ email }: { email: string }) => {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const [formData, SetFormData] = useState<{
    email: string
    password: string
  }>({ email, password: '' })
  const [formCompleted, setFormCompleted] = useState<boolean>(false)

  useEffect(() => {
    const { email, password } = formData

    if (email && password) {
      setFormCompleted(true)
    } else {
      setFormCompleted(false)
    }
  }, [formData])

  return (
    <div className="mx-6 overflow-hidden">
      <Card className="mx-auto max-w-sm mt-28">
        <CardHeader>
          <CardTitle className="text-2xl">
            {t('system.reset_password')}
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
                value={formData.email}
                required
                readOnly
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">{t('system.new_password')}</Label>
              </div>
              <Input
                id="password"
                type="password"
                name="password"
                required
                onChange={(e) => {
                  SetFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }}
              />
            </div>
            <Button type="submit" className="w-full" disabled={!formCompleted}>
              {fetcher.state !== 'idle' ? (
                <Spinner size="small" className="text-white" />
              ) : (
                t('system.submit')
              )}
            </Button>
          </fetcher.Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResetPassword
