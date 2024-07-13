import { Form, Link, useSubmit } from '@remix-run/react'
import { AlertCircle } from 'lucide-react'
import { FormEvent, useEffect, useState } from 'react'
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

const Register = ({ isSubmitSuccessful }: { isSubmitSuccessful: boolean }) => {
  const { t } = useTranslation()
  const [formData, SetFormData] = useState<{
    firstName: string
    lastName: string
    email: string
    password: string
  }>({ firstName: '', lastName: '', email: '', password: '' })
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [formCompleted, setFormCompleted] = useState<boolean>(false)
  const submit = useSubmit()

  useEffect(() => {
    const { firstName, lastName, email, password } = formData

    if (firstName && lastName && email && password) {
      setFormCompleted(true)
    } else {
      setFormCompleted(false)
    }
    setIsSubmitted(false)
  }, [formData])

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { firstName, lastName, email, password } = formData

    if (firstName && lastName && email && password) {
      setIsSubmitted(true)
      submit(formData, { method: 'POST' })
    }
  }

  return (
    <div className="mx-6 overflow-hidden lg:mx-0">
      <div className="max-w-screen-xl mx-auto h-full pt-24 flex justify-center">
        <Card className="mx-auto max-w-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              {t('system.create_new_account')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form
              method="POST"
              className="space-y-4 w-[300px]"
              onSubmit={submitHandler}
            >
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
              <div className="space-y-2">
                <Label htmlFor="email">{t('system.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => {
                    SetFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('system.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => {
                    SetFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={!formCompleted}
              >
                {isSubmitted ? (
                  <Spinner size="small" className="text-white" />
                ) : (
                  t('system.submit')
                )}
              </Button>

              {!isSubmitSuccessful && isSubmitted ? (
                <Alert variant="destructive" className="mt-3">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{t('system.error')}</AlertTitle>
                  <AlertDescription>
                    {t('system.register_failed')}
                  </AlertDescription>
                </Alert>
              ) : null}
            </Form>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Link to="/login">{t('system.already_have_account')}</Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default Register
