import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import AdminContext from '~/contexts/adminContext'

const ProductCategoryList = () => {
  const { t } = useTranslation()
  const { storeSettings } = useContext(AdminContext)

  return <></>
}

export default ProductCategoryList
