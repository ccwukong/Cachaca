import { createContext } from 'react'
import { PublicPage, StoreSettings, UserPublicInfo } from '~/types'

const initialValue: {
  navItems: { title: string; url: string; order: number }[]
  account: UserPublicInfo | null
  storeSettings: StoreSettings | null
  publicPages?: PublicPage[]
} = {
  navItems: [],
  account: null,
  storeSettings: null,
  publicPages: [],
}

const AdminContext = createContext(initialValue)

export default AdminContext
