import { createContext } from 'react'
import { CategoryItem, StoreSettings, UserPublicInfo } from '~/types'

const initialValue: {
  account: UserPublicInfo | null
  storeSettings: StoreSettings | null
  categories: CategoryItem[]
} = {
  account: null,
  storeSettings: null,
  categories: [],
}

const StoreContext = createContext(initialValue)

export default StoreContext
