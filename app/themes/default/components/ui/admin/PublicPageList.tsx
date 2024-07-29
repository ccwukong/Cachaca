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

const PublicPageList = () => {
  const { t } = useTranslation()
  const fetcher = useFetcher()
  const submit = useSubmit()
  const [pageEditOpen, setPageEditOpen] = useState(false)
  const [isCreate, setIsCreate] = useState(false)
  const [pageData, setPageData] = useState<{
    [key: string]: string | number
  }>({
    name: '',
    slug: '',
    content: '',
    order: 99,
    intent: '',
  })
  const { storeSettings } = useContext(AdminContext)
  const [isFormCompleted, setIsFormCompleted] = useState(false)

  const onEditorContentUpdate = (content: string) => {
    setPageData({
      ...pageData!,
      content,
    })
  }

  useEffect(() => {
    if (fetcher.data && !fetcher.data.error) {
      setPageEditOpen(false)
    }
  }, [fetcher.data])

  useEffect(() => {
    let formCompleted = true

    for (const key in pageData) {
      if (!pageData[key]) {
        formCompleted = false
        break
      }
    }
    setIsFormCompleted(formCompleted)
  }, [pageData])

  return (
    <>
      <Button
        className="bg-green-600 hover:bg-green-600 float-right"
        onClick={() => {
          setPageData({
            name: '',
            slug: '',
            content: '',
            order: 99,
            intent: 'create-page',
          })
          setIsCreate(true)
          setPageEditOpen(true)
        }}
      >
        {t('system.add')}
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('system.name')}</TableHead>
            <TableHead>{t('system.url')}</TableHead>
            <TableHead>{t('system.order')}</TableHead>
            <TableHead>
              <span className="sr-only">{t('system.actions')}</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        {storeSettings!.publicPages.length ? (
          <TableBody>
            {storeSettings!.publicPages.map((item) => (
              <TableRow key={item.name}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>/{item.slug}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {item.order}
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="link"
                    onClick={(e) => {
                      setPageData({ ...item, intent: 'update-page' })
                      setIsCreate(false)
                      setPageEditOpen(true)
                    }}
                  >
                    {t('system.edit')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <div className="text-center">{t('system.no_records_found')}</div>
        )}
      </Table>
      <Dialog
        open={pageEditOpen}
        onOpenChange={() => {
          setPageEditOpen(!pageEditOpen)
        }}
      >
        <DialogContent className="max-w-screen-md">
          <DialogHeader>
            <DialogTitle>
              {isCreate ? t('system.create_new_page') : t('system.edit_page')}
            </DialogTitle>
          </DialogHeader>
          <fetcher.Form
            onSubmit={(e) => {
              submit(pageData, { method: 'POST' })
            }}
            encType="application/x-www-form-urlencoded"
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label className="text-right">{t('system.name')}</Label>
              <Input
                id="page-name"
                name="page-name"
                className="col-span-3"
                required
                value={pageData.name || ''}
                onChange={(e) => {
                  setPageData({
                    ...pageData!,
                    name: e.target.value,
                  })
                }}
                readOnly={!isCreate}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-right">{t('system.slug')}</Label>
              <Input
                id="page-slug"
                name="page-slug"
                className="col-span-3"
                required
                value={pageData.slug || ''}
                onChange={(e) => {
                  setPageData({
                    ...pageData!,
                    slug: e.target.value,
                  })
                }}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-right">{t('system.order')}</Label>
              <Input
                id="page-order"
                name="page-order"
                className="col-span-3"
                type="number"
                required
                value={pageData.order || ''}
                onChange={(e) => {
                  setPageData({
                    ...pageData!,
                    order: Number(e.target.value),
                  })
                }}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-right">{t('system.description')}</Label>
              <Editor
                content={pageData.content as string}
                onChange={onEditorContentUpdate}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                name="intent"
                value={isCreate ? 'create-page' : 'update-page'}
                disabled={!isFormCompleted}
              >
                {fetcher.state !== 'idle' &&
                (pageData.intent === 'create-page' ||
                  pageData.intent === 'update-page') ? (
                  <Spinner size="small" className="text-white" />
                ) : (
                  t('system.save')
                )}
              </Button>
              {!isCreate ? (
                <Button
                  type="submit"
                  name="intent"
                  variant="destructive"
                  value="delete-page"
                  onClick={() => {
                    setPageData({ ...pageData!, intent: 'delete-page' })
                  }}
                >
                  {t('system.delete')}
                </Button>
              ) : null}
            </DialogFooter>
          </fetcher.Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PublicPageList
