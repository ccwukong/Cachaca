import { useState, useEffect, FormEvent } from 'react'
import { Form, useSubmit } from '@remix-run/react'
import { useTranslation } from 'react-i18next'
import { AlertCircle } from 'lucide-react'
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
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '~/themes/default/components/ui/alert'
import { Spinner } from '~/themes/default/components/ui/spinner'

type SetupFormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  storeName: string
  description: string
}

const initFormData: SetupFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  storeName: '',
  description: '',
}

const Install = ({ isSubmitSuccessful }: { isSubmitSuccessful: boolean }) => {
  const { t } = useTranslation()
  const submit = useSubmit()
  const [formCompleted, setFormCompleted] = useState<boolean>(false)
  const [formData, SetFormData] = useState<SetupFormData>(initFormData)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      storeName,
      description,
    } = formData

    if (
      firstName &&
      lastName &&
      email &&
      phone &&
      password &&
      storeName &&
      description
    ) {
      setFormCompleted(true)
    } else {
      setFormCompleted(false)
    }
    setIsSubmitted(false)
  }, [formData])

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      storeName,
      description,
    } = formData

    if (
      firstName &&
      lastName &&
      email &&
      phone &&
      password &&
      storeName &&
      description
    ) {
      setIsSubmitted(true)
      submit(formData, { method: 'POST' })
    }
  }
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-2xl gap-2">
        <h1 className="text-3xl font-semibold">{t('system.installation')}</h1>
      </div>
      <div className="mx-auto grid w-full max-w-2xl items-center">
        <Form method="post" onSubmit={submitHandler}>
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
                  <Label htmlFor="store-name">{t('system.store_name')}</Label>
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
                      name="first-name"
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
                      name="last-name"
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
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      SetFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">{t('system.phone')}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="string"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      SetFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">{t('system.password')}</Label>
                  <Input
                    id="password"
                    name="password"
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
            {isSubmitted ? (
              <Spinner size="small" className="text-white" />
            ) : (
              t('system.install')
            )}
          </Button>
        </Form>
        {!isSubmitSuccessful && isSubmitted ? (
          <Alert variant="destructive" className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('system.error')}</AlertTitle>
            <AlertDescription>{t('system.install_failed')}</AlertDescription>
          </Alert>
        ) : null}
      </div>
    </main>
  )
}

export default Install
