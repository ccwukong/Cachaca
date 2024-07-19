import { createContext } from 'react'
import { StoreSettings, UserPublicInfo } from '~/types'

const initialValue: {
  navItems: { title: string; url: string; order: number }[]
  account: UserPublicInfo | null
  storeSettings: StoreSettings | null
} = {
  navItems: [],
  account: null,
  storeSettings: null,
}

const AdminContext = createContext(initialValue)

export default AdminContext
