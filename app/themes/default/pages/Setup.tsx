import { useState, useEffect } from 'react'
import { Form, redirect } from '@remix-run/react'
import { useTranslation } from 'react-i18next'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/themes/default/components/ui/tabs'
import { Label } from '~/themes/default/components/ui/label'
import { Input } from '~/themes/default/components/ui/input'
import { Button } from '~/themes/default/components/ui/button'
import { Textarea } from '~/themes/default/components/ui/textarea'

type SetupFormData = {
  firstName: string
  lastName: string
  email: string
  password: string
  storeName: string
  description: string
}

const initFormData: SetupFormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  storeName: '',
  description: '',
}

const Setup = ({ isSubmitSuccessful }: { isSubmitSuccessful: boolean }) => {
  const { t } = useTranslation()
  const [formCompleted, setFormCompleted] = useState<boolean>(false)
  const [formData, SetFormData] = useState<SetupFormData>(initFormData)

  useEffect(() => {
    const { firstName, lastName, email, password, storeName, description } =
      formData

    if (
      firstName &&
      lastName &&
      email &&
      password &&
      storeName &&
      description
    ) {
      setFormCompleted(true)
    } else {
      setFormCompleted(false)
    }
  }, [formData])

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-2xl gap-2">
        <h1 className="text-3xl font-semibold">{t('system.installation')}</h1>
      </div>
      <div className="mx-auto grid w-full max-w-2xl items-center">
        <Form method="post">
          <Tabs defaultValue="account" className="w-full">
            <TabsList>
              <TabsTrigger value="account">
                {t('system.store_information')}
              </TabsTrigger>
              <TabsTrigger value="password">
                {t('system.admin_account')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">{t('system.store_name')}</Label>
                  <Input
                    id="store-name"
                    name="store-name"
                    type="text"
                    className="w-full"
                    required
                    value={formData.storeName}
                    onChange={(e) =>
                      SetFormData({ ...formData, storeName: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="description">{t('system.description')}</Label>
                  <Textarea
                    id="description"
                    name="description"
                    className="min-h-32"
                    required
                    value={formData.description}
                    onChange={(e) =>
                      SetFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="password">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="first-name">{t('system.firstname')}</Label>
                    <Input
                      id="first-name"
                      required
                      value={formData.firstName}
                      onChange={(e) =>
                        SetFormData({
                          ...formData,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="last-name">{t('system.lastname')}</Label>
                    <Input
                      id="last-name"
                      required
                      value={formData.lastName}
                      onChange={(e) =>
                        SetFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">{t('system.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      SetFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">{t('system.password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      SetFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <Button type="submit" className="mt-6" disabled={!formCompleted}>
            {t('system.install')}
          </Button>
        </Form>
      </div>
    </main>
  )
}

export default Setup
