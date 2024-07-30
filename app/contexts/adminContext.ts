import { createContext } from 'react'
import {
  EmailTemplateItem,
  PublicPage,
  StoreSettings,
  UserPublicInfo,
} from '~/types'

const initialValue: {
  navItems: { title: string; url: string; order: number }[]
  account: UserPublicInfo | null
  storeSettings: StoreSettings | null
  publicPages?: PublicPage[]
  emailTemplates?: EmailTemplateItem[]
} = {
  navItems: [],
  account: null,
  storeSettings: null,
  publicPages: [],
  emailTemplates: [],
}

const AdminContext = createContext(initialValue)

export default AdminContext
