import { useFetcher, useSubmit } from '@remix-run/react'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AdminContext from '~/contexts/adminContext'
import Editor from '~/themes/default/components/ui/admin/Editor'
import { Button } from '~/themes/default/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/themes/default/components/ui/dialog'
import { Input } from '~/themes/default/components/ui/input'
import { Label } from '~/themes/default/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/themes/default/components/ui/table'
import { Spinner } from '../spinner'

const EmailTemplateList = () => {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const submit = useSubmit()
  const [editOpen, setEditOpen] = useState(false)
  const [isCreate, setIsCreate] = useState(false)
  const [formData, setFormData] = useState<{
    [key: string]: string | number
  }>({
    name: '',
    subject: '',
    content: '',
    order: 99,
    intent: '',
  })
  const { emailTemplates } = useContext(AdminContext)
  const [isFormCompleted, setIsFormCompleted] = useState(false)

  const onEditorContentUpdate = (content: string) => {
    setFormData({
      ...formData!,
      content,
    })
  }

  useEffect(() => {
    if (fetcher.data && !fetcher.data.error) {
      setEditOpen(false)
    }
  }, [fetcher.data])

  useEffect(() => {
    let formCompleted = true

    for (const key in formData) {
      if (!formData[key]) {
        formCompleted = false
        break
      }
    }
    setIsFormCompleted(formCompleted)
  }, [formData])

  return (
    <>
      <Button
        className="bg-green-600 hover:bg-green-600 float-right"
        onClick={() => {
          setFormData({
            name: '',
            subject: '',
            content: '',
            intent: 'create-email-template',
          })
          setIsCreate(true)
          setEditOpen(true)
        }}
      >
        {t('system.add')}
      </Button>
      {emailTemplates && emailTemplates.length ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('system.name')}</TableHead>
              <TableHead>{t('system.subject')}</TableHead>
              <TableHead>
                <span className="sr-only">{t('system.actions')}</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {emailTemplates.map((item) => (
              <TableRow key={item.name}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.subject}</TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => {
                      setFormData({ ...item, intent: 'update-email-template' })
                      setIsCreate(false)
                      setEditOpen(true)
                    }}
                  >
                    {t('system.edit')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center pt-32">{t('system.no_records_found')}</div>
      )}
      <Dialog
        open={editOpen}
        onOpenChange={() => {
          setEditOpen(!editOpen)
        }}
      >
        <DialogContent className="max-w-screen-md">
          <DialogHeader>
            <DialogTitle>
              {isCreate ? t('system.create_new_page') : t('system.edit_page')}
            </DialogTitle>
          </DialogHeader>
          <fetcher.Form
            onSubmit={() => {
              submit(formData, { method: 'POST' })
            }}
            encType="application/x-www-form-urlencoded"
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label className="text-right">{t('system.name')}</Label>
              <Input
                id="email-template-name"
                name="email-template-name"
                className="col-span-3"
                required
                value={formData.name || ''}
                onChange={(e) => {
                  setFormData({
                    ...formData!,
                    name: e.target.value,
                  })
                }}
                readOnly={!isCreate}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-right">{t('system.subject')}</Label>
              <Input
                id="email-template-subject"
                name="email-template-subject"
                className="col-span-3"
                required
                value={formData.subject || ''}
                onChange={(e) => {
                  setFormData({
                    ...formData!,
                    subject: e.target.value,
                  })
                }}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-right">{t('system.description')}</Label>
              <Editor
                content={formData.content as string}
                onChange={onEditorContentUpdate}
              />
            </div>
            <DialogFooter>
              {!isCreate ? (
                <Button
                  type="submit"
                  name="intent"
                  variant="link"
                  value="delete-page"
                  className="text-red-600 hover:text-red-600 mr-6"
                  onClick={() => {
                    setFormData({
                      ...formData!,
                      intent: 'delete-email-template',
                    })
                  }}
                >
                  {fetcher.state !== 'idle' &&
                  (formData.intent === 'delete-email-template' ||
                    formData.intent === 'delete-email-template') ? (
                    <Spinner size="small" className="text-white" />
                  ) : (
                    t('system.delete')
                  )}
                </Button>
              ) : null}
              <Button
                type="submit"
                name="intent"
                value={
                  isCreate ? 'create-email-template' : 'update-email-template'
                }
                disabled={!isFormCompleted}
              >
                {fetcher.state !== 'idle' &&
                (formData.intent === 'create-email-template' ||
                  formData.intent === 'update-email-template') ? (
                  <Spinner size="small" className="text-white" />
                ) : (
                  t('system.save')
                )}
              </Button>
            </DialogFooter>
          </fetcher.Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default EmailTemplateList
