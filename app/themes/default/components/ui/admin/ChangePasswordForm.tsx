import { useFetcher } from '@remix-run/react'
import { AlertCircle } from 'lucide-react'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AdminContext from '~/contexts/adminContext'
import { Button } from '~/themes/default/components/ui/button'
import { Input } from '~/themes/default/components/ui/input'
import { Label } from '~/themes/default/components/ui/label'
import { Spinner } from '~/themes/default/components/ui/spinner'
import { Alert, AlertDescription, AlertTitle } from '../alert'

const ChangePasswordForm = () => {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const { account } = useContext(AdminContext)
  const [form] = useState({
    account: account!,
    oldPwd: '',
    newPwd: '',
  })

  return (
    <fetcher.Form method="POST">
      <div className="space-y-4 w-[480px]">
        <div className="space-y-2">
          <Label htmlFor="old-password">{t('system.old_password')}</Label>
          <Input
            type="password"
            id="old-password"
            name="old-password"
            value={form.oldPwd}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-password">{t('system.new_password')}</Label>
          <Input
            type="password"
            id="new-password"
            name="new-password"
            value={form.newPwd}
          />
        </div>
        <Button type="submit" name="intent" value="change-password">
          {fetcher.state !== 'idle' &&
          fetcher.formData?.get('intent') === 'change-password' ? (
            <Spinner size="small" className="text-white" />
          ) : (
            t('system.save')
          )}
        </Button>
        {fetcher.state === 'idle' && fetcher.data?.error ? (
          <Alert variant="destructive" className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('system.error')}</AlertTitle>
            <AlertDescription>
              {t('system.unmatched_password')}
            </AlertDescription>
          </Alert>
        ) : null}
      </div>
    </fetcher.Form>
  )
}

export default ChangePasswordForm
