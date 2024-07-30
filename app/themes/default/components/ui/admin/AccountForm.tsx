import { useFetcher } from '@remix-run/react'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AdminContext from '~/contexts/adminContext'
import { Button } from '~/themes/default/components/ui/button'
import { Input } from '~/themes/default/components/ui/input'
import { Label } from '~/themes/default/components/ui/label'
import { Spinner } from '~/themes/default/components/ui/spinner'

const AccountForm = () => {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const { account } = useContext(AdminContext)
  const [form, setForm] = useState({
    account: account!,
  })

  return (
    <fetcher.Form method="POST">
      <div className="space-y-4 w-[480px]">
        <div className="space-y-2">
          <Label htmlFor="email">{t('system.email')}</Label>
          <Input
            type="text"
            id="email"
            name="email"
            value={form.account.email}
            disabled
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="firstname">{t('system.firstname')}</Label>
          <Input
            type="text"
            id="firstname"
            name="firstname"
            value={form.account.firstName}
            onChange={(e) => {
              setForm({
                ...form,
                account: {
                  ...form.account,
                  firstName: e.target.value,
                },
              })
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastname">{t('system.lastname')}</Label>
          <Input
            type="text"
            id="lastname"
            name="lastname"
            value={form.account.lastName}
            onChange={(e) => {
              setForm({
                ...form,
                account: {
                  ...form.account,
                  lastName: e.target.value,
                },
              })
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">{t('system.phone')}</Label>
          <Input
            type="text"
            id="phone"
            name="phone"
            value={form.account.phone}
            onChange={(e) => {
              setForm({
                ...form,
                account: {
                  ...form.account,
                  phone: e.target.value,
                },
              })
            }}
          />
        </div>
        <Button type="submit" name="intent" value="account-info">
          {fetcher.state !== 'idle' &&
          fetcher.formData?.get('intent') === 'account-info' ? (
            <Spinner size="small" className="text-white" />
          ) : (
            t('system.save')
          )}
        </Button>
      </div>
    </fetcher.Form>
  )
}

export default AccountForm
