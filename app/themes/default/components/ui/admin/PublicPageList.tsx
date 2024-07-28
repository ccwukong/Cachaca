import { Form } from '@remix-run/react'
import { useContext, useState } from 'react'
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

const PublicPageList = () => {
  const { t } = useTranslation()
  const [pageEditOpen, setPageEditOpen] = useState(false)
  const { storeSettings } = useContext(AdminContext)

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('system.title')}</TableHead>
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
                    onClick={(e) => setPageEditOpen(true)}
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
            <DialogTitle>{t('system.edit_page')}</DialogTitle>
          </DialogHeader>
          <Form method="POST" className="space-y-4">
            <div className="space-y-2">
              <Label className="text-right">{t('system.title')}</Label>
              <Input
                id="page-title"
                name="page-title"
                className="col-span-3"
                required
                value=""
                onChange={(e) => {}}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-right">{t('system.slug')}</Label>
              <Input
                id="page-slug"
                name="page-slug"
                className="col-span-3"
                required
                value=""
                onChange={(e) => {}}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-right">{t('system.description')}</Label>
              <Editor content={'Type content here...'} />
            </div>
          </Form>
          <DialogFooter>
            <Button type="submit">{t('system.save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PublicPageList
