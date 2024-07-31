import { useFetcher, useSubmit } from '@remix-run/react'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AdminContext from '~/contexts/adminContext'
import { Button } from '../button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../dialog'
import { Input } from '../input'
import { Label } from '../label'
import { Spinner } from '../spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../table'

const ProductCategoryList = () => {
  const { t } = useTranslation()
  const { categoryItem } = useContext(AdminContext)


  const submit = useSubmit()
  const fetcher = useFetcher()

  const [isFormCompleted, setIsFormCompleted] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [isCreate, setIsCreate] = useState(false)
  const [formData, setFormData] = useState<{
    [key: string]: string | number | null
  }>({
    name: '',
    slug: '',
    intent: '',
    parentId: '',
  })

  useEffect(() => {
    if (fetcher.data && !fetcher.data.error) {
      setEditOpen(false)
    }
  }, [fetcher.data])


  return (
    <>
      <Button className='bg-green-600 text-black float-start'
        onClick={() => {
          setFormData({
            name: '',
            slug: '',
            intent: 'create-category',
            parentId: ''
          })

          setEditOpen(true)
          setIsCreate(true)
        }}
      >
        {t('system.add')}
      </Button>
      {categoryItem && categoryItem.length ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('system.category')}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {categoryItem.map((category) =>
              <TableRow key={category.name}>
                <TableCell>{category.id}</TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => {
                      setFormData({ ...category, intent: 'update-category' })
                      setIsCreate(false)
                      setEditOpen(true)
                    }}>
                    {t('system.edit')}
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center pt-32">{t('system.no_records_found')}</div>
      )}
      <Dialog
        open={editOpen}
        onOpenChange={() => {
          setEditOpen(!editOpen)
        }}>
        <DialogContent>
          <DialogHeader className="max-w-screen-sm">
            <DialogTitle>
              {isCreate ? t('system.create_new_category') : t('system.edit_category')}
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
              <Label className="text-right">{t('system.category')} </Label>
              <Input
                id="category-name"
                name="category-name"
                className="col-span-3"
                required
                value={formData.name || ''}
                onChange={(e) => {
                  setFormData({
                    ...formData!,
                    name: e.target.value
                  })
                }}
                readOnly={!isCreate} />
                </div>
                <div className="space-y-2">
              <Label className="text-right">{t('system.slug')} </Label>
              <Input
                id="category-slug" 
                name="category-slug"
                className="col-span-3"
                required
                value={formData.slug || ''}
                onChange={(e) => {
                  setFormData({
                    ...formData!,
                    slug: e.target.value
                  })
                }}
              />
            </div>
            <DialogFooter>
              {!isCreate ? (
                <Button
                  type="submit"
                  name="intent"
                  variant="link"
                  value="delete-category"
                  className="text-red-600 hover:text-red-600 mr-6"
                  onClick={() => {
                    setFormData({ ...formData!, intent: 'delete-category' })
                  }}
                >
                  {fetcher.state !== 'idle' &&
                    (formData.intent === 'delete-category') ?
                    (<Spinner size="small" className="text-white" />)
                    : (
                      t('system.delete')
                    )}
                </Button>
              ) : null}
              <Button
                type="submit"
                name="intent"
                value={isCreate ? 'create-category' : 'update-category'}
              >
                {fetcher.state !== 'idle' &&
                  (formData.intent === 'create-category' ||
                    formData.intent === 'update-category') ? (
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
export default ProductCategoryList
